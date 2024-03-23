import NotFoundError from '@project/errors/src/not_found_error'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult } from '@project/result/src'

export interface IAuthSingleUseCode {
  complex: string
  singleUseCode: string
  expireAt: number
  alreadyUsed?: boolean
}

export interface IAuthSingleUseCodeCreated extends IAuthSingleUseCode{
  id: string
}

export interface IAuthInput{
  complex: string
  apiKey: string
}

export interface IJwtPayload{
  accessToken: string
}

export interface IAuthenticationSingleUseCodeRepository {
  validateSingleUseCode: (id: string, currentTime: number) => AsyncResult<boolean, UnknownError | NotFoundError>
  saveSingleUseCode: (input: IAuthSingleUseCode) => AsyncResult<IAuthSingleUseCodeCreated, UnknownError>
  getSingleUseCode: (singleUseCode: string) => AsyncResult<IAuthSingleUseCode, UnknownError | NotFoundError>
  disableSingleUseCode: (singleUseCode: string) => AsyncResult<IAuthSingleUseCode, UnknownError | NotFoundError>
}
