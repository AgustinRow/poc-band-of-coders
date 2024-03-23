import BaseError from './base_error'

export enum IntegrationErrorCodes {
  INTEGRATION_EVENT_MEDIATOR_NOT_FOUND = 'INTEGRATION_EVENT_MEDIATOR_NOT_FOUND'
}

export default class IntegrationError extends BaseError<IntegrationErrorCodes> {
}
