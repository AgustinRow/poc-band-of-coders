import AuthenticationError from '@project/errors/src/authentication_error'
import ForbiddenError from '@project/errors/src/forbidden_error'
import NotFoundError from '@project/errors/src/not_found_error'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, Result } from '@project/result/src'
import jwt from 'jsonwebtoken'

export enum EnumAuthProvider {
  project = 'project',
}
export interface IprojectAuthInfo {
  externalUserId: string
  externalBookId: string
}

export interface IAuthenticationProvider {
  getCurrentUser: () => AsyncResult<
  {
    authProvider: EnumAuthProvider
    authProviderOpaqueUserId: string
    token: string
  },
  UnknownError | AuthenticationError
  >
  verifyToken: (
    token: string
  ) => Result<string | jwt.JwtPayload, AuthenticationError>
  generateAccessToken: (data: any) => Result<string, UnknownError>
  generateRefreshToken: (data: any) => Result<void, UnknownError>
  decodeToken: (token: string) => Result<any, AuthenticationError>
  validateSession: () => AsyncResult<
  string,
  AuthenticationError | ForbiddenError | UnknownError | NotFoundError
  >

}
