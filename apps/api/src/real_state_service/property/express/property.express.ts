import { Request, Response } from 'express'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpGet, httpPost, request, response } from 'inversify-express-utils'
import requestResolver from '~/utils/express/request_resolver'
import PropertyControllers from '../controllers/property'
import PropertyPresenters from '../presenters/property'

@controller('/properties')
export class PropertyExpressControllers extends BaseHttpController {
  constructor (
    @inject('PropertyControllers') private readonly propertyControllers: PropertyControllers,
    @inject('PropertyPresenters') private readonly propertyPresenters: PropertyPresenters
  ) {
    super()
  }

  @httpPost('')
  async createProperty (@request() req: Request, @response() res: Response): Promise<void> {
    return await requestResolver(req, res, this.propertyControllers.createProperty, this.propertyPresenters.getById)
  }

  @httpGet('')
  async getAllProperties (@request() req: Request, @response() res: Response): Promise<void> {
    return await requestResolver(req, res, this.propertyControllers.getAllProperties, this.propertyPresenters.getAllProperties)
  }

  @httpGet('/:id')
  async getById (@request() req: Request, @response() res: Response): Promise<void> {
    return await requestResolver(req, res, this.propertyControllers.getById, this.propertyPresenters.getById)
  }
}
