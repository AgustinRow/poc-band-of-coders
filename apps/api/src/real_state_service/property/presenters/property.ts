import { inject } from 'inversify'
import abind from 'abind'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import PropertyUseCases from '../use_cases/property'

export interface APIProperty {
  id: string
  apartmentNumber: string
  complex: string
  surname: string
}

export default class PropertyPresenters {
  constructor (
    @inject('PropertyUseCases') private readonly propertyUseCases: PropertyUseCases
  ) {
    abind(this)
  }

  async getById (id: string): AsyncResult<APIProperty, UnknownError | NotFoundError> {
    const property = await this.propertyUseCases.getById(id)
    if (property.isErr()) return err(property.error)
    const propertyAPI: APIProperty = {
      id: property.value.id,
      apartmentNumber: property.value.apartmentNumber,
      complex: property.value.complex,
      surname: property.value.surname
    }
    return ok(propertyAPI)
  }

  async getAllProperties (ids: string[]): AsyncResult<APIProperty[], UnknownError | NotFoundError> {
    const propertyAPI: APIProperty[] = []
    for (const propertyId of ids) {
      const property = await this.propertyUseCases.getById(propertyId)
      if (property.isErr()) return err(property.error)
      propertyAPI.push({
        id: property.value.id,
        apartmentNumber: property.value.apartmentNumber,
        complex: property.value.complex,
        surname: property.value.surname
      })
    }
    return ok(propertyAPI)
  }
}
