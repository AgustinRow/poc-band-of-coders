import { EventsCollectionMap, IEventsCollection, EventNames, ValidEvents, IReadOnlyEventsCollection } from './interfaces'

export class EventsCollection<Events> implements IEventsCollection<Events> {
  private readonly _events: EventsCollectionMap<Events> = {}

  public add<Type extends EventNames<Events>>(event: ValidEvents<Events>[Type]): void {
    const eventType = event.type as Type

    if (this._events[eventType] === undefined) {
      this._events[eventType] = []
    }

    // @ts-expect-error
    this._events[eventType].push(event)
  }

  public remove<Type extends EventNames<Events>>(event: ValidEvents<Events>[Type]): void {
    const eventType = event.type as Type

    this._events[eventType] = this._events[eventType]?.filter(e => !e.equals(event))
  }

  public get<Type extends EventNames<Events>>(type: Type): Array<ValidEvents<Events>[Type]> {
    return this._events[type] ?? []
  }

  public getAll (): EventsCollectionMap<Events> {
    return this._events
  }

  public toReadOnlyUniqueEvents (): IReadOnlyEventsCollection<Events> {
    const collection = new EventsCollection<Events>()

    for (const eventType in this._events) {
      collection._events[eventType as EventNames<Events>] = []

      for (const event of this._events[eventType as EventNames<Events>] ?? []) {
        // @ts-expect-error
        if (collection._events[eventType as EventNames<Events>].every(e => !e.equals(event))) {
          // @ts-expect-error
          collection._events[eventType as EventNames<Events>].push(event)
        }
      }
    }

    return collection
  }
}
