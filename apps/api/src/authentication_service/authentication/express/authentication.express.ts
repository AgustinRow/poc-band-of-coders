import { Request, Response } from 'express'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpPost, request, response } from 'inversify-express-utils'
import requestResolver from '~/utils/express/request_resolver'
import AuthenticationControllers from '../controllers/authentication'
import AuthenticationPresenters from '../presenters/authentication'

@controller('/authentication')
export class AuthenticationExpressControllers extends BaseHttpController {
  constructor (
    @inject('AuthenticationControllers') private readonly authenticationControllers: AuthenticationControllers,
    @inject('AuthenticationPresenters') private readonly authenticationPresenters: AuthenticationPresenters
  ) {
    super()
  }

  @httpPost('/single-use-code')
  async createProperty (@request() req: Request, @response() res: Response): Promise<void> {
    if ('apiKey' in req.query) {
      return await requestResolver(req, res, this.authenticationControllers.getSingleUseCode, this.authenticationPresenters.getSingleUseCode)
    } else {
      throw new Error('apiKey is required')
    }
  }

  @httpPost('/token')
  async authenticateWithSingleCode (@request() req: Request, @response() res: Response): Promise<void> {
    return await requestResolver(req, res, this.authenticationControllers.authenticateWithSingleCode, undefined)
  }
}
