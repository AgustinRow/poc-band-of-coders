import { inject } from 'inversify'
import abind from 'abind'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import AuthenticationUseCases from '../use_cases/authentication'

export interface ISingleUseCode {
  singleUseCode: string
}

export default class AuthenticationPresenters {
  constructor (
    @inject('AuthenticationUseCases') private readonly authenticationUseCases: AuthenticationUseCases
  ) {
    abind(this)
  }

  async getSingleUseCode (id: string): AsyncResult<ISingleUseCode, UnknownError | NotFoundError> {
    const singleUseCode = id
    const authSingleUseCode = await this.authenticationUseCases.getSingleUseCodeById(singleUseCode)
    if (authSingleUseCode.isErr()) return err(authSingleUseCode.error)

    return ok({ singleUseCode: authSingleUseCode.value })
  }
}
