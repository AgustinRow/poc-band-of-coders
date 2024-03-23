import { EventHandler, EventHandlersCollectionMap, EventNames, IEventHandlersCollection, ValidEvents } from './interfaces'

export class EventHandlersCollection<Events> implements IEventHandlersCollection<Events> {
  private _eventHandlers: EventHandlersCollectionMap<Events> = {}

  add<Type extends EventNames<Events>>(eventType: Type, handler: EventHandler<ValidEvents<Events>[Type]>): void {
    if (this._eventHandlers[eventType] === undefined) {
      this._eventHandlers[eventType] = []
    }

    // @ts-expect-error
    this._eventHandlers[eventType].push(handler)
  }

  remove<Type extends EventNames<Events>>(eventType: Type, handler: EventHandler<ValidEvents<Events>[Type]>): void {
    this._eventHandlers[eventType] = this._eventHandlers[eventType]?.filter(h => h !== handler)
  }

  get<Type extends EventNames<Events>>(eventType: Type): Array<EventHandler<ValidEvents<Events>[Type]>> {
    return this._eventHandlers[eventType] ?? []
  }

  getAll (): EventHandlersCollectionMap<Events> {
    return this._eventHandlers
  }
}
