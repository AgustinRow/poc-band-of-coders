import { isString } from 'lodash-es'

enum GenericReason {
  UNKNOWN = 'UNKNOWN',
}

export default class BaseError<Reason = GenericReason> extends Error {
  constructor (
    public readonly reason: Reason,
    messageOrOriginalError?: string | any,
    public readonly originalError?: any,
    public readonly httpStatusCode?: number
  ) {
    super(isString(messageOrOriginalError) ? messageOrOriginalError : undefined)

    if (!isString(messageOrOriginalError)) {
      this.originalError = {
        ...messageOrOriginalError,
        message: messageOrOriginalError.message,
        stack: messageOrOriginalError.stack,
        stacktrace: messageOrOriginalError.stacktrace
      }
    }
  }
}
