import { AsyncResult } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import UnknownError from '@project/errors/src/unknown_error'

export interface IControllerFinders<IEntity, IFilter = unknown> {
  findById: (id: string) => AsyncResult<IEntity, NotFoundError | UnknownError>
  findAll: (filter?: IFilter) => AsyncResult<string[], UnknownError>
}
