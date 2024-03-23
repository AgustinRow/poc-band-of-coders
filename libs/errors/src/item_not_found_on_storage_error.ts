import BaseError from './base_error'

export enum ItemNotFoundOnStorageErrorCodes {
  NOT_FOUND = 'NOT_FOUND'
}

export default class ItemNotFoundOnStorageError extends BaseError<ItemNotFoundOnStorageErrorCodes> {
  constructor (message: string, originalError?: Error | unknown) {
    super(ItemNotFoundOnStorageErrorCodes.NOT_FOUND, message, originalError)
  }
}
