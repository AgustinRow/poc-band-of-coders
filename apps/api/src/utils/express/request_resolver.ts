import BaseError from '@project/errors/src/base_error'
import { AsyncResult, Result } from '@project/result/src'
import { Request, Response } from 'express'
import { isFunction } from 'lodash-es'

function isMutation (req: Request): boolean {
  return req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE'
}

export default async function requestResolver<R, E extends BaseError<any>, PE extends BaseError<any>> (
  req: Request,
  res: Response,
  controller: (args: any) => AsyncResult<R, E>,
  presenter?: (args: R) => AsyncResult<any, PE>
): Promise<void> {
  try {
    let payload

    if (req.method === 'GET') {
      payload = { ...req.params, ...req.query }
    } else if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT' || req.method === 'PATCH') {
      payload = { ...req.params, ...req.query, ...req.body }
    }

    const controllerResult = await controller({ ...payload })
    let requestResult: Result<R, E> | Result<any, PE> = controllerResult

    if (isFunction(presenter) && controllerResult.isOk()) {
      requestResult = await presenter(controllerResult.value)
    }

    if (requestResult.isErr()) {
      console.error(requestResult.error)
      let response
      if (isMutation(req)) {
        response = {
          error: requestResult.error,
          message: requestResult.error.message ?? 'An error ocurred while executing the request',
          success: false,
          code: requestResult.error.reason.toString()
        }
      } else {
        response = {
          error: requestResult.error
        }
      }
      res.status(requestResult.error.httpStatusCode ?? 500).send(response)
    } else {
      let response
      if (isMutation(req)) {
        response = {
          data: requestResult.value,
          message: 'Operation executed successfully',
          success: true,
          code: 'SUCCESS'
        }
      } else {
        response = {
          data: requestResult.value
        }
      }

      res.status(200).send(response)
    }
  } catch (err) {
    console.error(err)

    let response
    if (isMutation(req)) {
      response = {
        data: null,
        error: err,
        message: 'An unhandled error ocurred while executing the request',
        success: false,
        code: 'UNHANDLED_ERROR'
      }
    } else {
      response = {
        data: null,
        error: err
      }
    }

    res.status(500).send(response)
  }
}
