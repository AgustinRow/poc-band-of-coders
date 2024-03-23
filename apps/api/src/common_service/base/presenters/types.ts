import { AsyncResult } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import UnknownError from '@project/errors/src/unknown_error'

export interface IPresenterFinders<P> {
  getOne: (id: string) => AsyncResult<P, NotFoundError | UnknownError>
  getMany: (ids: string[]) => AsyncResult<P[], UnknownError | NotFoundError>
}
