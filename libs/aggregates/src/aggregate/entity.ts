import { AggregateBaseEvents } from './events'
import { AggregateBaseState, IState } from './state'
import { IEventHandlersCollection, IReadOnlyEventsCollection } from '../events/interfaces'

export abstract class AggregateEntity<
  State extends IState,
  Events, Schema
  > extends AggregateBaseState<State, Events, Schema> {
  private readonly _pathWithinParent: string

  constructor (
    private readonly _parent: AggregateBaseEvents<Events>,
    pathWithinParent: string,
    getNewId?: () => string
  ) {
    super()
    this._pathWithinParent = pathWithinParent
  }

  // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
  clone (
    overrideParent?: AggregateBaseEvents<Events>,
    overridePathWithinParent?: string
  ): AggregateEntity<State, Events, Schema> {
    const cloned = Object.assign(Object.create(Object.getPrototypeOf(this)), this)

    if (overrideParent !== undefined) {
      cloned._parent = overrideParent
    }

    if (overridePathWithinParent !== undefined) {
      cloned._pathWithinParent = overridePathWithinParent
    }

    return cloned
  }

  protected async dispatchEmittedEvents (): Promise<void> {
    this.parent.addEventsToCurrentTransaction(
      this.getUniqueRegisteredEvents()
    )
  }

  addEventsToCurrentTransaction (events: IReadOnlyEventsCollection<Events>): void {
    this.parent.addEventsToCurrentTransaction(events)
  }

  get aggregateName (): string {
    return this.parent.aggregateName
  }

  get aggregateRootId (): string {
    return this.parent.aggregateRootId
  }

  get eventHandlers (): IEventHandlersCollection<Events> {
    return this.parent.eventHandlers
  }

  get parent (): AggregateBaseEvents<Events> {
    return this._parent
  }

  get pathWithinAggregate (): string[] {
    return [
      ...this.parent.pathWithinAggregate,
      ...(this._pathWithinParent === '' ? [] : [this._pathWithinParent]),
      this.id
    ]
  }

  get pathWithinParent (): string {
    return this._pathWithinParent
  }
}
