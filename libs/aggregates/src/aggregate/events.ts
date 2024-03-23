import { EventsCollection } from '../events/events_collection'
import { EventTypes, IEntity, IEventHandlersCollection, IReadOnlyEventsCollection } from '../events/interfaces'

export abstract class AggregateBaseEvents<Events> implements IEntity {
  private readonly _registeredEvents = new EventsCollection<Events>()

  abstract get id (): string
  abstract get aggregateName (): string
  abstract get aggregateRootId (): string
  abstract get pathWithinAggregate (): string[]
  abstract get isDeleted (): boolean
  abstract get eventHandlers (): IEventHandlersCollection<Events>

  get registeredEvents (): IReadOnlyEventsCollection<Events> {
    return this._registeredEvents.toReadOnlyUniqueEvents()
  }

  protected abstract dispatchEmittedEvents (): Promise<void>
  abstract addEventsToCurrentTransaction (events: IReadOnlyEventsCollection<Events>): void

  protected emitEvent (event: EventTypes<Events>): void {
    this._registeredEvents.add(event)
  }

  protected cancelEvent (event: EventTypes<Events>): void {
    this._registeredEvents.remove(event)
  }

  protected getUniqueRegisteredEvents (): IReadOnlyEventsCollection<Events> {
    return this.registeredEvents
  }

  equals (entity: IEntity): boolean {
    return (
      entity instanceof AggregateBaseEvents &&
      entity.id === this.id &&
      entity.aggregateName === this.aggregateName &&
      entity.aggregateRootId === this.aggregateRootId &&
      entity.pathWithinAggregate.join() === this.pathWithinAggregate.join()
    )
  }
}
