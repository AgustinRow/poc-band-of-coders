import abind from 'abind'
import { AsyncResult, err, ok } from '@project/result/src'
import UnknownError from '@project/errors/src/unknown_error'
import NotFoundError from '@project/errors/src/not_found_error'
import { isNil } from 'lodash-es'
import { requestNamespace } from '~/web_api/3rd_party/cls_namespaces'
import AuthorizationError, {
  AuthorizationErrorCodes
} from '@project/errors/src/authorization_error'

export default class AuthorizationUseCases {
  constructor (

  ) {
    abind(this)
  }

  async canCurrentUserAccessResource (
    propertyId: string
  ): AsyncResult<void, UnknownError | AuthorizationError | NotFoundError> {
    const currentProperty = requestNamespace.get('complex')
    console.log(currentProperty)
    if (isNil(currentProperty)) {
      return err(new NotFoundError('Complex property not found in token'))
    }

    if (currentProperty !== propertyId) {
      return err(
        new AuthorizationError(
          'Not allowed to access this proypert',
          undefined,
          AuthorizationErrorCodes.ACCESS_DENIED
        )
      )
    }

    return ok()
  }
}
