import BaseError from './base_error'

export enum ForbiddenErrorCodes {
  ACCESS_DENIED = 'ACCESS_DENIED'
}

export default class ForbiddenError extends BaseError<ForbiddenErrorCodes> {
  constructor (
    errorCode: ForbiddenErrorCodes,
    message: string,
    originalError?: Error | unknown
  ) {
    super(errorCode, message, originalError, 403)
  }
}
