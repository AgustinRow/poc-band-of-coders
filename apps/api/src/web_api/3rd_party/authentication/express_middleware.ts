import { NextFunction, Request, Response, Router } from 'express'
import { isNil } from 'lodash-es'
import { requestNamespace } from '../cls_namespaces'
import AuthenticationProvider from '~/authentication_service/3rd_party/jwt/auth_provider'

const UNTRUSTED_PATHS = [
  '/authentication/single-use-code',
  '/authentication/token'
]

function isUntrustedPath (recPath: string): boolean {
  return UNTRUSTED_PATHS.some((path) => recPath.startsWith(path))
}

export default function storeAccessTokenInAuthHandler (req: Request, res: Response, next: NextFunction): void {
  if (!isNil(req.headers.authorization)) {
    requestNamespace.set('accessToken', req.headers.authorization.replace(/^bearer\s+/i, ''))
  }

  next()
}

export const checkWithNonEmptyTokens = (req: Request, res: Response, next: NextFunction): void => {
  if (isNil(requestNamespace.get('accessToken'))) {
    res.status(401).send({
      data: null,
      error: 401,
      message: 'Access token not found',
      success: false,
      code: 'UNAUTHORIZED'
    })
  } else {
    next()
  }
}

export const checkWithVerifiedTokens = (req: Request, res: Response, next: NextFunction): void => {
  const provider = new AuthenticationProvider()
  const currentUserFromProvider = provider.verifyToken(requestNamespace.get('accessToken'))

  if (currentUserFromProvider.isErr()) {
    res.status(currentUserFromProvider.error.httpStatusCode ?? 401).send({
      data: null,
      error: currentUserFromProvider.error,
      message: currentUserFromProvider.error.message ?? 'Access denied',
      success: false,
      code: currentUserFromProvider.error.reason.toString()
    })
  } else {
    const decodedToken = provider.decodeToken(requestNamespace.get('accessToken'))
    if (decodedToken.isOk()) {
      requestNamespace.set('complex', decodedToken.value.complex)
    }
    next()
  }
}

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (isUntrustedPath(req.path)) {
    next()
  } else {
    const composed = Router().use(checkWithNonEmptyTokens, checkWithVerifiedTokens)
    return composed(req, res, next)
  }
}
