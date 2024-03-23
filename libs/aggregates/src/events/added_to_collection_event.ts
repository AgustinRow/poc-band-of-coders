import { DomainEvent } from './domain_event'
import { IAddedToCollectionEvent, IEntity, ValidPropertiesForCollectionEvent, ValidPropertyNamesForCollectionEvent } from './interfaces'
import { isEntity } from './is_entity'
import { isEntityEqual } from './is_entity_equal'

export class AddedToCollectionEvent<
  Type extends string,
  Entity extends IEntity,
  Property extends ValidPropertyNamesForCollectionEvent<Entity>
> extends DomainEvent<Type>
  implements Partial<IAddedToCollectionEvent<Type, Entity, Property>> {
  constructor (
    type: Type,
    entity: Entity,
    readonly propertyName: Property,
    readonly added: ValidPropertiesForCollectionEvent<Entity>[Property][number],
    readonly index: number
  ) {
    super(type, entity)
  }

  override equals (event: DomainEvent<Type>): boolean {
    return (
      super.equals(event) &&
      event instanceof AddedToCollectionEvent &&
      this.propertyName === event.propertyName &&
      (
        isEntity(this.added)
          ? isEntityEqual(this.added, event.added)
          : this.added === event.added
      ) &&
      this.index === event.index
    )
  }
}
