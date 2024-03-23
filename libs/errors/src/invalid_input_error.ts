import BaseError from './base_error'

enum InvalidInputErrorCodes {
  INVALID_INPUT_ERROR = 'INVALID_INPUT_ERROR'
}

export default class InvalidInputError extends BaseError<InvalidInputErrorCodes> {
  protected field?: string

  constructor (message: string, originalError?: Error | unknown, field?: string) {
    super(InvalidInputErrorCodes.INVALID_INPUT_ERROR, message, originalError)
    this.field = field
  }
}
