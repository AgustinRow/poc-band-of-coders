import { AggregateBaseState, IRepository, IState } from "./state";
import {
  EventNames,
  EventTypes,
  IEventHandlersCollection,
  IReadOnlyEventsCollection,
} from "../events/interfaces";
import { AsyncResult } from "@project/result/src";
import InvalidStateError from "@project/errors/src/invalid_state_error";
import NotFoundError from "@project/errors/src/not_found_error";
import UnknownError from "@project/errors/src/unknown_error";

export abstract class AggregateRoot<
  State extends IState,
  Events,
  StateValidationSchema
> extends AggregateBaseState<State, Events, StateValidationSchema> {
  private readonly _eventHandlers: IEventHandlersCollection<Events>;
  private readonly _aggregateName: string;
  private _transactionEvents?: Array<IReadOnlyEventsCollection<Events>>;

  constructor(
    eventHandlers: IEventHandlersCollection<Events>,
    aggregateName?: string
  ) {
    super();
    this._eventHandlers = eventHandlers;
    this._aggregateName = aggregateName ?? this.constructor.name;
  }

  override async save(
    repositoryOrSaveFunction: IRepository<State> | IRepository<State>["save"]
  ): AsyncResult<string, UnknownError | InvalidStateError | NotFoundError> {
    if (this._transactionEvents !== undefined) {
      throw new Error(
        "Cannot save aggregate while another save is in progress"
      );
    }

    this._transactionEvents = [];

    const result = await super.save(repositoryOrSaveFunction);
    this._transactionEvents = undefined;

    return result;
  }

  addEventsToCurrentTransaction(
    events: IReadOnlyEventsCollection<Events>
  ): void {
    if (this._transactionEvents === undefined) {
      throw new Error(
        "Cannot add events to current transaction while no transaction is in progress"
      );
    }

    this._transactionEvents.push(events);
  }

  protected async dispatchEmittedEvents(): Promise<void> {
    if (this._transactionEvents === undefined) {
      throw new Error(
        "Cannot dispatch events while no transaction is in progress"
      );
    }

    await this.dispatchEvents([
      ...this._transactionEvents,
      this.getUniqueRegisteredEvents(),
    ]);
  }

  private async dispatchEvents(
    events: Array<IReadOnlyEventsCollection<Events>>
  ): Promise<void> {
    for (const eventsCollection of events) {
      for (const eventType in eventsCollection.getAll()) {
        const events = eventsCollection.get(eventType as EventNames<Events>);

        for (const event of events) {
          await this.dispatchEvent(event);
        }
      }
    }
  }

  private async dispatchEvent(event: EventTypes<Events>): Promise<void> {
    for (const handler of this._eventHandlers.get(
      event.type as EventNames<Events>
    )) {
      await handler(event);
    }
  }

  get aggregateName(): string {
    return this._aggregateName;
  }

  get aggregateRootId(): string {
    return this.id;
  }

  get pathWithinAggregate(): string[] {
    return [];
  }

  get eventHandlers(): IEventHandlersCollection<Events> {
    return this._eventHandlers;
  }
}
