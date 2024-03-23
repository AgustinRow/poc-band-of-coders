import NotFoundError from '@project/errors/src/not_found_error'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok } from '@project/result/src'
import abind from 'abind'
import resultListPresenterFromIds from '~/utils/result_list_presenter'
import { IUseCaseFinders } from '../use_cases/types'
import { IPresenterFinders } from './types'

export default abstract class PresenterFinders<T extends {id: string}, P extends {[key: string]: any}, F = unknown>
implements IPresenterFinders<P> {
  constructor (
    protected readonly useCases: IUseCaseFinders<T, F>,
    private readonly mapper: (item: T & {id: string}) => Promise<P> | P
  ) {
    abind(this)
    this.getMany = this.getMany.bind(this)
    this.getOne = this.getOne.bind(this)
  }

  getMany = resultListPresenterFromIds(this.getOne.bind(this))

  async getOne (id: string): AsyncResult<P, UnknownError | NotFoundError> {
    const item = await this.useCases.findById(id)
    if (item.isErr()) { return err(item.error) }

    return ok(await this.mapper(item.value))
  }
}
