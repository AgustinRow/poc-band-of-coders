import UnknownError from '@project/errors/src/unknown_error'
import NotFoundError from '@project/errors/src/not_found_error'
import { AsyncResult } from '@project/result/src'

export interface PropertyId {
  id: string
}

export interface PropertyAttributes {
  apartmentNumber: string
  complex: string
  surname: string
}

export interface IProperty extends PropertyId, PropertyAttributes {}

export interface IPropertyRepository {
  getById: (id: string) => AsyncResult<IProperty, UnknownError | NotFoundError>
  insert: (property: PropertyAttributes) => AsyncResult<string, UnknownError | NotFoundError>
  findAll: () => AsyncResult<string[], UnknownError | NotFoundError>
  getPropertyByComplex: (complex: string) => AsyncResult<PropertyAttributes[], UnknownError | NotFoundError>
}
