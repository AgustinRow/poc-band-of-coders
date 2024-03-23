import BaseError from './base_error'

export enum AuthorizationErrorCodes {
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  BUILD_AUTHORIZATION_ENTITY_ERROR = 'BUILD_AUTHORIZATION_ENTITY_ERROR'
}

export default class AuthorizationError extends BaseError<AuthorizationErrorCodes> {
  constructor (message: string, originalError?: Error | unknown, code?: AuthorizationErrorCodes) {
    super(code ?? AuthorizationErrorCodes.UNAUTHORIZED_ERROR, message, originalError)
  }
}
