import { IAuthInput, IAuthenticationSingleUseCodeRepository, IJwtPayload } from './interfaces'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import AuthenticationError, { AuthenticationErrorCodes } from '@project/errors/src/authentication_error'
import { inject } from 'inversify'
import { API_KEY } from '~/web_api/constants_common'
import crypto from 'crypto'
import { isNil } from 'lodash-es'

export default class AuthenticationUseCases {
  constructor (
    @inject('IAuthenticationSingleUseCodeRepository') private readonly authSingleUseCodeRepository: IAuthenticationSingleUseCodeRepository
  ) {}

  async getSingleUseCode (input: IAuthInput): AsyncResult<string, UnknownError | NotFoundError | AuthenticationError> {
    const { apiKey, complex } = input
    if (apiKey !== API_KEY) return err(new AuthenticationError(AuthenticationErrorCodes.INVALID_API_KEY))

    const expireAt = Date.now() + 120000
    const singleCodeVerified = await this.authSingleUseCodeRepository.validateSingleUseCode(complex, Date.now())

    if (singleCodeVerified.isErr()) return err(singleCodeVerified.error)

    const singleUseCode = crypto.randomBytes(8).toString('hex') // Random 32-character hezadecimal string
    const codeSaved = await this.authSingleUseCodeRepository.saveSingleUseCode({
      complex,
      singleUseCode,
      expireAt
    })

    if (codeSaved.isErr()) { return err(codeSaved.error) }
    return ok(codeSaved.value.singleUseCode)
  }

  async getSingleUseCodeById (singleUseCode: string): AsyncResult<string, UnknownError | NotFoundError> {
    const autheSingleUseCode = await this.authSingleUseCodeRepository.getSingleUseCode(singleUseCode)
    if (autheSingleUseCode.isErr()) return err(autheSingleUseCode.error)

    return ok(autheSingleUseCode.value.singleUseCode)
  }

  async authenticateWithSingleCode (input: {singleUseCode: string}): AsyncResult<IJwtPayload, UnknownError | NotFoundError | AuthenticationError > {
    const { singleUseCode } = input

    const singleUseCodeValidation = await this.authSingleUseCodeRepository.getSingleUseCode(singleUseCode)
    if (singleUseCodeValidation.isErr()) return err(singleUseCodeValidation.error)
    if (isNil(singleUseCodeValidation.value.alreadyUsed)) return err(new AuthenticationError(AuthenticationErrorCodes.INVALID_SINGLE_USE_CODE))
    if (singleUseCodeValidation.value.alreadyUsed) return err(new AuthenticationError(AuthenticationErrorCodes.INVALID_SINGLE_USE_CODE))
    if (singleUseCodeValidation.value.expireAt < Date.now()) return err(new AuthenticationError(AuthenticationErrorCodes.INVALID_SINGLE_USE_CODE))

    const singleUseCodeDisabled = await this.authSingleUseCodeRepository.disableSingleUseCode(singleUseCode)
    if (singleUseCodeDisabled.isErr()) return err(singleUseCodeDisabled.error)

    // todo: implement provider to create access, and refresh token
    const accessToken = 'ey123453'
    const refreshToken = 'ey54321'
    return ok({ accessToken, refreshToken })
  }
}
