import { inject } from 'inversify'
import abind from 'abind'
import AuthenticationUseCases from '../use_cases/authentication'
import { AsyncResult, err, ok } from '@project/result/src'
import UnknownError from '@project/errors/src/unknown_error'
import NotFoundError from '@project/errors/src/not_found_error'
import { InferTypesOnPropertySectionInputs } from './schema.validations'

import AuthenticationError from '@project/errors/src/authentication_error'
import { IJwtPayload } from '../use_cases/interfaces'

export default class AuthenticationControllers {
  constructor (
    @inject('AuthenticationUseCases') private readonly authenticationUseCases: AuthenticationUseCases
  ) {
    abind(this)
  }

  async getSingleUseCode (input: InferTypesOnPropertySectionInputs['getSingleUseCode']): AsyncResult<string, UnknownError | NotFoundError | AuthenticationError> {
    const singleUseCode = await this.authenticationUseCases.getSingleUseCode(input)
    if (singleUseCode.isErr()) return err(singleUseCode.error)
    return ok(singleUseCode.value)
  }

  async authenticateWithSingleCode (input: InferTypesOnPropertySectionInputs['validateSingleUseCode']): AsyncResult<IJwtPayload, UnknownError | NotFoundError | AuthenticationError> {
    const authenticated = await this.authenticationUseCases.authenticateWithSingleCode(input)
    if (authenticated.isErr()) return err(authenticated.error)
    return ok(authenticated.value)
  }
}
