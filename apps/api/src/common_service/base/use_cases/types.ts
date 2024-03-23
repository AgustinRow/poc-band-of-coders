import { AsyncResult } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import UnknownError from '@project/errors/src/unknown_error'

export interface IUseCaseFinders<IEntity, IFilter = unknown> {
  findById: (id: string) => AsyncResult<IEntity, NotFoundError | UnknownError>
  findAll: (filter?: IFilter) => AsyncResult<string[], UnknownError>
}

export interface IRepositoryFinders<IEntity, IFilter = unknown> {
  findById: (id: string) => AsyncResult<IEntity, NotFoundError | UnknownError>
  findAll: (filter?: IFilter) => AsyncResult<IEntity[], UnknownError>
}
