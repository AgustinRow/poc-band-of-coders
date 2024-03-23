import { NextFunction, Request, Response } from 'express'
import { requestNamespace, sequelizeNamespace } from '.'

function applyRequestNamespace (req: Request, res: Response, next: NextFunction): void {
  requestNamespace.run(() => {
    sequelizeNamespace.run(() => {
      next()
    })
  })
}

export default applyRequestNamespace
