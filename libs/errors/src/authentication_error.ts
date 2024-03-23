import BaseError from './base_error'

export enum AuthenticationErrorCodes {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  INVALID_EMAIL = 'INVALID_EMAIL',
  TENANT_NOT_FOUND = 'TENANT_NOT_FOUND',
  INVALID_API_KEY = 'INVALID_API_KEY',
  INVALID_SINGLE_USE_CODE = 'INVALID_SINGLE_USE_CODE'
}

export default class AuthenticationError extends BaseError<AuthenticationErrorCodes> {
  constructor (
    message: string,
    code: AuthenticationErrorCodes = AuthenticationErrorCodes.NOT_AUTHENTICATED,
    originalError?: Error | unknown
  ) {
    super(code, message, originalError)
  }
}
