export interface IEntity {
  id?: string
  aggregateRootId?: string
  aggregateName: string
  pathWithinAggregate: string[]
}

export interface IDomainEvent<Type extends string> {
  readonly type: Type
  readonly timestamp: Date
  readonly aggregateRootId: string
  readonly aggregateName: string
  readonly pathWithinAggregate: string[]
  readonly entityId: string
  readonly _entity: IEntity
  readonly userId?: string
  equals: (event: IDomainEvent<Type>) => boolean
}

export type PropertyUpdateInvalidTypes = object | any[]
export type PropertyUpdateType<T> = T extends PropertyUpdateInvalidTypes ? never : T
export type ValidPropertiesForUpdateEvent<Entity extends IEntity> = {
  [K in keyof Entity as (
    PropertyUpdateType<Entity[K]> extends never ? never : K
  )]: PropertyUpdateType<Entity[K]>
}
export type ValidPropertyNamesForUpdateEvent<Entity extends IEntity> = keyof ValidPropertiesForUpdateEvent<Entity>

export interface IPropertyUpdatedEvent<
  Type extends string,
  Entity extends IEntity,
  Property extends ValidPropertyNamesForUpdateEvent<Entity>
> extends IDomainEvent<Type> {
  readonly propertyName: Property
  readonly previousValue: ValidPropertiesForUpdateEvent<Entity>[Property]
  readonly currentValue: ValidPropertiesForUpdateEvent<Entity>[Property]
}

export type CollectionEventItemType<T> = (
  T extends IEntity
    ? IEntity
    : T extends string | number | boolean | Date
      ? T
      : never
)
export type CollectionEventPropertyType<T> = (
  T extends Array<infer E>
    ? CollectionEventItemType<E> extends never
      ? never
      : Array<CollectionEventItemType<E>>
    : never
)
export type ValidPropertiesForCollectionEvent<Entity extends IEntity> = {
  [K in Exclude<keyof Entity, keyof IEntity> as (
    CollectionEventPropertyType<Entity[K]> extends never
      ? never
      : K
  )]: CollectionEventPropertyType<Entity[K]>
}
export type ValidPropertyNamesForCollectionEvent<Entity extends IEntity> = keyof ValidPropertiesForCollectionEvent<Entity>

export interface IAddedToCollectionEvent<
  Type extends string,
  Entity extends IEntity,
  Property extends ValidPropertyNamesForCollectionEvent<Entity>
> extends IDomainEvent<Type> {
  readonly propertyName: Property
  readonly added: ValidPropertiesForCollectionEvent<Entity>[Property][number]
  readonly index: number
}

export interface IRemovedFromCollectionEvent<
  Type extends string,
  Entity extends IEntity,
  Property extends ValidPropertyNamesForCollectionEvent<Entity>
> extends IDomainEvent<Type> {
  readonly propertyName: Property
  readonly removed: ValidPropertiesForCollectionEvent<Entity>[Property][number]
  readonly index: number
}

export interface IIntegrationEvent<Type extends string> extends IDomainEvent<Type> {
  readonly id: string
}

export type IEvent<Type extends string> = IDomainEvent<Type> | IIntegrationEvent<Type>

export type ValidEvents<Events> = {
  [K in keyof Events as (
    K extends string
      ? Events[K] extends IDomainEvent<K>
        ? K
        : never
      : never
  )]: Events[K] extends IDomainEvent<any> ? Events[K] : never
}

export type EventNames<Events> = Exclude<keyof ValidEvents<Events>, symbol | number>

export type EventTypes<Events> = ValidEvents<Events>[EventNames<Events>]

export type EventHandler<Event> = (
  (event: Event) => Promise<void>
)

export type EventsCollectionMap<Events> = {
  [key in EventNames<Events>]?: Array<ValidEvents<Events>[key]>
}

export type EventHandlersCollectionMap<Events> = {
  [key in EventNames<Events>]?: Array<EventHandler<ValidEvents<Events>[key]>>
}

export interface IReadOnlyEventsCollection<Events> {
  get: <Type extends EventNames<Events>>(type: Type) => Array<ValidEvents<Events>[Type]>
  getAll: () => EventsCollectionMap<Events>
}

export interface IEventsCollection<Events> extends IReadOnlyEventsCollection<Events> {
  add: <Type extends EventNames<Events>>(event: ValidEvents<Events>[Type]) => void
  remove: <Type extends EventNames<Events>>(event: ValidEvents<Events>[Type]) => void
}

export interface IReadOnlyEventHandlersCollection<Events> {
  get: <Type extends EventNames<Events>>(eventType: Type) => Array<EventHandler<ValidEvents<Events>[Type]>>
  getAll: () => EventHandlersCollectionMap<Events>
}

export interface IEventHandlersCollection<Events> extends IReadOnlyEventHandlersCollection<Events> {
  add: <Type extends EventNames<Events>>(eventType: Type, handler: EventHandler<ValidEvents<Events>[Type]>) => void
  remove: <Type extends EventNames<Events>>(eventType: Type, handler: EventHandler<ValidEvents<Events>[Type]>) => void
}
