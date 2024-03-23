import BaseError from './base_error'

enum InvalidObjectSchemaErrorCodes {
  INVALID_OBJECT_SCHEMA_ERROR = 'INVALID_OBJECT_SCHEMA_ERROR'
}

export default class InvalidObjectSchemaError extends BaseError<InvalidObjectSchemaErrorCodes> {
  protected field?: string

  constructor (message: string, originalError?: Error | unknown, field?: string) {
    super(InvalidObjectSchemaErrorCodes.INVALID_OBJECT_SCHEMA_ERROR, message, originalError)
    this.field = field
  }
}
