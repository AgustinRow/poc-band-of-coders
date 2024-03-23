import { isNil } from 'lodash-es'
import { IDomainEvent, IEntity } from './interfaces'

export class DomainEvent<Type extends string, Entity extends IEntity = IEntity> implements IDomainEvent<Type> {
  readonly timestamp: Date = new Date()

  constructor (
    readonly type: Type,
    readonly _entity: Entity,
    public readonly userId?: string
  ) {
  }

  get aggregateName (): string {
    return this._entity.aggregateName
  }

  get pathWithinAggregate (): string[] {
    return this._entity.pathWithinAggregate
  }

  get entityId (): string {
    if (isNil(this._entity.id)) {
      throw new Error('Entity ID is not set')
    }
    return this._entity.id
  }

  get aggregateRootId (): string {
    if (isNil(this._entity.aggregateRootId)) {
      throw new Error('Aggregate root ID is not set')
    }
    return this._entity.aggregateRootId
  }

  equals (event: IDomainEvent<Type>): boolean {
    return (
      event instanceof DomainEvent &&
      this.type === event.type &&
      this.timestamp.getTime() === event.timestamp.getTime() &&
      this.aggregateRootId === event.aggregateRootId &&
      this.aggregateName === event.aggregateName &&
      this.entityId === event.entityId &&
      this.pathWithinAggregate.join('.') === event.pathWithinAggregate.join('.')
    )
  }
}
