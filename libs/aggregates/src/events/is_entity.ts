import { IEntity } from './interfaces'

export function isEntity (value: any): value is IEntity {
  return (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof value.id === 'string' &&
    typeof value.aggregateRootId === 'string' &&
    typeof value.aggregateName === 'string' &&
    Array.isArray(value.pathWithinAggregate) &&
    value.pathWithinAggregate.every((path: any) => typeof path === 'string')
  )
}
