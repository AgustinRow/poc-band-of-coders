import { IEntity } from './interfaces'
import { isEntity } from './is_entity'

export function isEntityEqual (entity1: IEntity, entity2: IEntity): boolean {
  return (
    isEntity(entity1) &&
    isEntity(entity2) &&
    entity1.id === entity2.id &&
    entity1.aggregateRootId === entity2.aggregateRootId &&
    entity1.aggregateName === entity2.aggregateName &&
    entity1.pathWithinAggregate.join('.') === entity2.pathWithinAggregate.join('.')
  )
}
