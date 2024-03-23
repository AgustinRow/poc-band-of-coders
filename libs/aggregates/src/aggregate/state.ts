import { AsyncResult, err, ok, Result } from '@project/result/src'
import { AggregateBaseEvents } from './events'
import { validate, validateAt } from '@project/schema-validation/src'
import { isNil } from 'lodash-es'
import { SchemaOf } from 'yup'
import InvalidInputError from '@project/errors/src/invalid_input_error'
import InvalidStateError from '@project/errors/src/invalid_state_error'
import ItemNotFoundOnStorageError from '@project/errors/src/item_not_found_on_storage_error'
import UnknownError from '@project/errors/src/unknown_error'

export const isDeleted = Symbol('isDeleted')
export const isNew = Symbol('isNew')

export interface IState {
  id?: string
  [isDeleted]?: boolean
  [isNew]?: boolean
  [key: string]: any
}

export type CompleteState<State extends IState> = (
  State & {
    id: string
    [isDeleted]: boolean
    [isNew]: boolean
  }
)

export type PersistedState<T extends ({ id?: any } | { id: any })> = Omit<T, 'id'> & Required<Pick<T, 'id'>>

export interface IRepository<State extends IState> {
  save: (aggregate: CompleteState<State>) => AsyncResult<string, UnknownError | ItemNotFoundOnStorageError>
}

export interface IRepositoryClient<State extends IState> {
  save: (aggregate: CompleteState<State>) => AsyncResult<State, UnknownError | ItemNotFoundOnStorageError>
}

export abstract class AggregateBaseState<
  State extends IState,
  Events,
  Schema
  > extends AggregateBaseEvents<Events> {
  private __state?: CompleteState<State>
  protected schema?: SchemaOf<Schema>

  protected get _state (): CompleteState<State> {
    if (this.__state === undefined) {
      throw new Error('State is not initialized')
    }

    return this.__state
  }

  protected set _state (sharedState: State) {
    if (this.__state !== undefined) {
      throw new Error('State is already initialized')
    }

    sharedState[isNew] = isNil(sharedState.id)
    sharedState[isDeleted] = false
    this.__state = sharedState as CompleteState<State>
  }

  private isKeyOfSchema (key: string): key is Extract<keyof Schema, string> {
    return this.schema !== undefined && 'fields' in this.schema && Object.keys(this.schema.fields).includes(key)
  }

  public setField<F extends Extract<keyof Omit<State, 'id'>, string>> (field: F, value: Omit<CompleteState<State>, 'id'>[F]): Result<void, InvalidInputError> {
    if (!isNil(this.schema)) {
      if (this.isKeyOfSchema(field)) {
        const validation = validateAt(this.schema, field, value)

        if (validation.isErr()) { return err(new InvalidInputError('Invalid state field input', validation.error, field)) }
      }
    }

    this._state[field] = value

    return ok()
  }

  async validateState (): AsyncResult<void, InvalidStateError> {
    if (isNil(this.schema)) { return ok() }

    const validation = await validate(this.schema, this._state)

    return validation.isOk() ? ok() : err(new InvalidStateError('Invalid state', validation.error))
  }

  async save (repositoryOrSaveFunction: IRepository<State> | IRepository<State>['save']): AsyncResult<string, UnknownError | InvalidStateError | ItemNotFoundOnStorageError> {
    let result
    const stateValidation = await this.validateState()
    if (stateValidation.isErr()) { return err(stateValidation.error) }

    if (typeof repositoryOrSaveFunction === 'function') {
      result = await repositoryOrSaveFunction(this._state)
    } else {
      result = await repositoryOrSaveFunction.save(this._state)
    }

    if (result.isOk()) { this._state.id = result.value }
    await this.dispatchEmittedEvents()

    return result
  }

  get id (): string {
    if (this._state.id === undefined) { throw new Error('You are trying to read an undefined id') }

    return this._state.id
  }

  get isDeleted (): boolean {
    return this._state[isDeleted]
  }

  get isNew (): boolean {
    return this._state[isNew]
  }

  delete (): void {
    this._state[isDeleted] = true
  }
}
