import { DomainEvent } from './domain_event'
import { IEntity, IPropertyUpdatedEvent, ValidPropertiesForUpdateEvent, ValidPropertyNamesForUpdateEvent } from './interfaces'

export class PropertyUpdatedEvent<
  EventType extends string,
  Entity extends IEntity,
  PropertyName extends ValidPropertyNamesForUpdateEvent<Entity>
> extends DomainEvent<EventType>
  implements IPropertyUpdatedEvent<EventType, Entity, PropertyName> {
  constructor (
    type: EventType,
    override readonly _entity: Entity,
    readonly propertyName: PropertyName,
    readonly previousValue: ValidPropertiesForUpdateEvent<Entity>[PropertyName]
  ) {
    super(type, _entity)
  }

  get currentValue (): ValidPropertiesForUpdateEvent<Entity>[PropertyName] {
    return this._entity[
      this.propertyName as keyof Entity
    ] as ValidPropertiesForUpdateEvent<Entity>[PropertyName]
  }

  override equals (event: DomainEvent<EventType>): boolean {
    return (
      super.equals(event) &&
      event instanceof PropertyUpdatedEvent &&
      this.propertyName === event.propertyName &&
      this.previousValue === event.previousValue
    )
  }
}
