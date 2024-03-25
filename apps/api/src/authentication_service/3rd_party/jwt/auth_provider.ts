import AuthenticationError, {
  AuthenticationErrorCodes
} from '@project/errors/src/authentication_error'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok, Result } from '@project/result/src'
import { isNil } from 'lodash-es'
import { requestNamespace } from '~/web_api/3rd_party/cls_namespaces'
import { EnumAuthProvider, IAuthenticationProvider } from '../services'
import jwt from 'jsonwebtoken'
import {
  AUTH_JWT_ACCESS_EXPIRATION,
  AUTH_JWT_REFRESH_EXPIRATION_IN_DAYS,
  AUTH_JWT_SECRET
} from '~/web_api/constant_api'
import NotFoundError from '@project/errors/src/not_found_error'
import ForbiddenError from '@project/errors/src/forbidden_error'

export default class AuthenticationProvider implements IAuthenticationProvider {
  async getCurrentUser (): AsyncResult<
  {
    authProvider: EnumAuthProvider
    authProviderOpaqueUserId: string
    token: string
  },
  UnknownError | AuthenticationError
  > {
    const token = requestNamespace.get('accessToken')
    if (isNil(token)) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.INVALID_TOKEN,
          'Access token cannot be found'
        )
      )
    }
    const decodedToken = jwt.decode(token)
    if (typeof decodedToken === 'string' || decodedToken === null) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.INVALID_TOKEN,
          'Invalid Token'
        )
      )
    }
    if (!('user_id' in decodedToken)) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.USER_NOT_FOUND,
          'User not found in token'
        )
      )
    }
    return ok({
      authProvider: EnumAuthProvider.project,
      authProviderOpaqueUserId: decodedToken.user_id,
      token
    })
  }

  verifyToken (
    token: string
  ): Result<string | jwt.JwtPayload, AuthenticationError> {
    try {
      const secret = AUTH_JWT_SECRET
      const authToken = jwt.verify(token, secret)
      if (isNil(authToken)) {
        return err(
          new AuthenticationError(
            AuthenticationErrorCodes.INVALID_TOKEN,
            'Invalid token'
          )
        )
      }
      return ok(authToken)
    } catch (error) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.INVALID_TOKEN,
          error as string
        )
      )
    }
  }

  generateAccessToken (data: any): Result<string, UnknownError> {
    try {
      const secret = AUTH_JWT_SECRET
      const accessToken = jwt.sign(data, secret, {
        expiresIn: AUTH_JWT_ACCESS_EXPIRATION
      })
      if (isNil(accessToken)) { return err(new UnknownError('Failed to generate access token')) }
      requestNamespace.set('accessToken', accessToken)
      return ok(accessToken)
    } catch (error) {
      return err(new UnknownError(error as string))
    }
  }

  generateRefreshToken (data: any): Result<void, UnknownError> {
    try {
      const secret = AUTH_JWT_SECRET

      const refreshToken = jwt.sign(data, secret, {
        expiresIn: AUTH_JWT_REFRESH_EXPIRATION_IN_DAYS
      })
      if (isNil(refreshToken)) { return err(new UnknownError('Failed to generate refresh token')) }
      requestNamespace.set('refreshToken', refreshToken)

      return ok()
    } catch (error) {
      return err(new UnknownError(error as string))
    }
  }

  decodeToken (token: string): Result<any, AuthenticationError> {
    try {
      const decodedToken = jwt.decode(token)
      if (isNil(decodedToken)) {
        return err(
          new AuthenticationError(
            AuthenticationErrorCodes.INVALID_TOKEN,
            'Invalid Token'
          )
        )
      }
      return ok(decodedToken)
    } catch (error) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.INVALID_TOKEN,
          error as string
        )
      )
    }
  }

  async validateSession (): AsyncResult<
  string,
  AuthenticationError | UnknownError | NotFoundError | ForbiddenError
  > {
    const refreshTokenCookie = requestNamespace.get('refreshToken')
    if (
      isNil(refreshTokenCookie) ||
      !`${String(refreshTokenCookie)}`.includes('=')
    ) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.INVALID_TOKEN,
          'Refresh token cannot be parser from cookie'
        )
      )
    }

    const refreshToken = refreshTokenCookie.split('=')[1]
    if (isNil(refreshToken)) {
      return err(
        new AuthenticationError(
          AuthenticationErrorCodes.INVALID_TOKEN,
          'Refresh token cannot be found'
        )
      )
    }
    const decodedToken = this.decodeToken(refreshToken)
    if (decodedToken.isErr()) return err(decodedToken.error)

    delete decodedToken.value.iat
    delete decodedToken.value.exp

    const verifiedToken = this.verifyToken(refreshToken)
    if (verifiedToken.isErr()) return err(verifiedToken.error)

    const newRefreshToken = await this.generateRefreshToken(decodedToken.value)
    if (newRefreshToken.isErr()) return err(newRefreshToken.error)

    const accessToken = this.generateAccessToken(decodedToken.value)
    if (accessToken.isErr()) return err(accessToken.error)

    return ok(accessToken.value)
  }
}
