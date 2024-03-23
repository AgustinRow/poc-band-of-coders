import UnknownError from '@project/errors/src/unknown_error'
import { err, ok, AsyncResult } from '@project/result/src'
import { PropertyAttributes, IPropertyRepository, IProperty } from '../use_cases/interfaces'
import NotFoundError from '@project/errors/src/not_found_error'
import { Property } from '../models/property.model'
import { isNil } from 'lodash-es'

export class SequelizePropertyRepository implements IPropertyRepository {
  async getById (id: string): AsyncResult<IProperty, UnknownError | NotFoundError> {
    try {
      const property = await Property.findByPk(id)
      if (isNil(property)) return err(new NotFoundError('Property not found'))
      return ok(property)
    } catch (error) {
      console.log(error)
      return err(new UnknownError('Failed to get property'))
    }
  }

  async insert (property: PropertyAttributes): AsyncResult<string, UnknownError | NotFoundError> {
    try {
      const newProperty = await Property.create(property)
      return ok(newProperty.id)
    } catch (error) {
      console.log(error)
      return err(new UnknownError('Failed to insert property'))
    }
  }

  async findAll (): AsyncResult<string[], UnknownError | NotFoundError> {
    try {
      const properties = await Property.findAll()
      if (isNil(properties)) return err(new NotFoundError('Properties not found'))
      return ok(properties.map(property => property.dataValues.id))
    } catch (error) {
      console.log(error)
      return err(new UnknownError('Failed to get properties'))
    }
  }

  async getPropertyByComplex (complex: string): AsyncResult<PropertyAttributes[], UnknownError | NotFoundError> {
    try {
      const properties = await Property.findAll({ where: { complex } })
      if (isNil(properties)) return err(new NotFoundError('Properties not found'))
      return ok(properties.map(property => property.dataValues))
    } catch (error) {
      console.log(error)
      return err(new UnknownError('Failed to get properties'))
    }
  }
}
