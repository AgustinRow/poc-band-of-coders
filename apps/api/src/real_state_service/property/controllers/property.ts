import { inject } from 'inversify'
import abind from 'abind'
import PropertyUseCases from '../use_cases/property'
import { AsyncResult, err, ok } from '@project/result/src'
import UnknownError from '@project/errors/src/unknown_error'
import NotFoundError from '@project/errors/src/not_found_error'
import { InferTypesOnPropertySectionInputs } from './schema.validations'
import InvalidInputError from '@project/errors/src/invalid_input_error'

export default class PropertyControllers {
  constructor (
    @inject('PropertyUseCases') private readonly propertyUseCases: PropertyUseCases
  ) {
    abind(this)
  }

  async createProperty (input: InferTypesOnPropertySectionInputs['createProperty']): AsyncResult<string, UnknownError | NotFoundError | InvalidInputError > {
    const property = await this.propertyUseCases.createProperty(input)
    if (property.isErr()) return err(property.error)
    return ok(property.value)
  }

  async getAllProperties (): AsyncResult<string[], UnknownError | NotFoundError> {
    return await this.propertyUseCases.getAllProperties()
  }

  async getById (input: InferTypesOnPropertySectionInputs['getById']): AsyncResult<string, UnknownError | NotFoundError> {
    const property = await this.propertyUseCases.getById(input.id)
    if (property.isErr()) return err(property.error)
    return ok(property.value.id)
  }
}
