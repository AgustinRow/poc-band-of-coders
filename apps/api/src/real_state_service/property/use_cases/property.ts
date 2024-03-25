import { IPropertyRepository, IProperty, PropertyAttributes } from './interfaces'
import UnknownError from '@project/errors/src/unknown_error'
import { AsyncResult, err, ok } from '@project/result/src'
import NotFoundError from '@project/errors/src/not_found_error'
import { inject } from 'inversify'
import InvalidInputError from '@project/errors/src/invalid_input_error'
import { isNil } from 'lodash-es'
import AuthorizationUseCases from '~/authorization_service/authorization/use_cases/authorization'
import AuthorizationError from '@project/errors/src/authorization_error'

export default class PropertyUseCases {
  constructor (
    @inject('IPropertyRepository') private readonly propertyRepository: IPropertyRepository,
    @inject('AuthorizationUseCases') private readonly authorizationUseCases: AuthorizationUseCases
  ) {}

  async createProperty (property: PropertyAttributes): AsyncResult<string, UnknownError | NotFoundError | InvalidInputError | AuthorizationError> {
    const auth = await this.authorizationUseCases.canCurrentUserAccessResource(property.complex)
    if (auth.isErr()) return err(auth.error)

    const complex = await this.propertyRepository.getPropertyByComplex(property.complex)
    if (complex.isErr()) return err(complex.error)

    const complexApartmentExist = complex.value.find(p => p.apartmentNumber === property.apartmentNumber)
    if (!isNil(complexApartmentExist)) return err(new InvalidInputError('Apartment already exist'))

    const newProperty = await this.propertyRepository.insert(property)
    if (newProperty.isErr()) return err(newProperty.error)

    return ok(newProperty.value)
  }

  async getById (id: string): AsyncResult<IProperty, UnknownError | NotFoundError > {
    const property = await this.propertyRepository.getById(id)
    if (property.isErr()) return err(property.error)

    return ok(property.value)
  }

  async getAllProperties (): AsyncResult<string[], UnknownError | NotFoundError > {
    const properties = await this.propertyRepository.findAll()
    if (properties.isErr()) return err(properties.error)
    return ok(properties.value)
  }
}
