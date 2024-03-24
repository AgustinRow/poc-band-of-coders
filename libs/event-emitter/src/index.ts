import { AsyncResult } from "@project/result/src";

type Unsubscribe = () => void;
type EventListener<TData> = (
  data: TData
) => AsyncResult<void, unknown> | Promise<void> | void;
interface EventTypesBase {
  [name: string]: any;
}

type ValueTypes<
  ObjectType extends EventTypesBase &
    Partial<{ _listenerAdded: any; _listenerRemoved: any }>
> = ObjectType[keyof ObjectType];
export interface ListenerEventData<
  EventTypes extends EventTypesBase,
  EventName extends keyof EventTypes
> {
  event: EventName;
  listener: EventListener<EventTypes[EventName]>;
  newListenerCount: number;
}

type AllEventTypes<EventTypes extends EventTypesBase> = EventTypes & {
  _listenerAdded: ValueTypes<{
    [EventName in keyof EventTypes]: ListenerEventData<EventTypes, EventName>;
  }>;
  _listenerRemoved: ValueTypes<{
    [EventName in keyof EventTypes]: ListenerEventData<EventTypes, EventName>;
  }>;
};

type EmitOptions<DataType> = {
  onListenerError?: (error: any) => void;
} & (DataType extends undefined ? { data?: never } : { data: DataType });

export class EventEmitter<
  EventTypes extends EventTypesBase,
  _EventTypes extends AllEventTypes<EventTypes> = AllEventTypes<EventTypes>
> {
  private readonly _listeners = new Map<
    keyof _EventTypes,
    Set<EventListener<ValueTypes<_EventTypes>>>
  >();

  public on<EventName extends keyof _EventTypes>(
    name: EventName,
    listener: EventListener<_EventTypes[EventName]>
  ): Unsubscribe {
    const listeners = this._getListeners(name);
    listeners.add(listener);

    void this.emit(
      "_listenerAdded",
      // @ts-expect-error
      { data: { event: name, listener, newListenerCount: listeners.size } }
    );

    return () => {
      listeners.delete(listener);

      void this.emit(
        "_listenerRemoved",
        // @ts-expect-error
        { data: { event: name, listener, newListenerCount: listeners.size } }
      );
    };
  }

  public async emit<EventName extends keyof _EventTypes>(
    name: EventName,
    ...options: _EventTypes[EventName] extends undefined
      ? [EmitOptions<_EventTypes[EventName]>?]
      : [EmitOptions<_EventTypes[EventName]>]
  ): Promise<void> {
    await this._emitSequential(name, options[0]);
  }

  private async _emitSequential<EventName extends keyof _EventTypes>(
    name: EventName,
    options?: EmitOptions<_EventTypes[EventName]>
  ): Promise<void> {
    const listeners = Array.from(this._getListeners(name).values());

    for (const listener of listeners) {
      await this._runListener(listener, options);
    }
  }

  private async _runListener<TData>(
    listener: EventListener<TData>,
    options?: EmitOptions<TData>
  ): Promise<void> {
    try {
      // @ts-expect-error
      await listener(options?.data);
    } catch (err) {
      if (typeof options?.onListenerError === "function") {
        options.onListenerError(err);
      } else {
        throw err;
      }
    }
  }

  private _getListeners<EventName extends keyof _EventTypes>(
    name: EventName
  ): Set<EventListener<_EventTypes[EventName]>> {
    let listeners = this._listeners.get(name);

    if (listeners === undefined) {
      listeners = new Set();
      this._listeners.set(name, listeners);
    }

    return listeners;
  }

  protected getListenersCount<EventName extends keyof _EventTypes>(
    name: EventName
  ): number {
    const listeners = this._getListeners(name);

    return listeners.size;
  }
}
