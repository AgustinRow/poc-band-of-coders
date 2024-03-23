import { NextFunction, Request, Response } from 'express'
import { isNil } from 'lodash-es'
import { requestNamespace } from '../cls_namespaces'

export default function storeAccessTokenInAuthHandler (req: Request, res: Response, next: NextFunction): void {
  if (!isNil(req.headers.authorization)) {
    requestNamespace.set('accessToken', req.headers.authorization.replace(/^bearer\s+/i, ''))
  }

  next()
}
