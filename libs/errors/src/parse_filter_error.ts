import BaseError from './base_error'

export enum ParserErrorCodes {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_FILTER_SPEC = 'INVALID_FILTER_SPEC'
}

export default class ParseFilterError extends BaseError<ParserErrorCodes> {
  constructor (message: string, originalError?: Error | unknown, code?: ParserErrorCodes) {
    super(code ?? ParserErrorCodes.UNKNOWN_ERROR, message, originalError)
  }
}
