export type UUID = string
export type Instant = string

export interface ItemError {
  fields?: string[]
  message?: string
}

export interface ValidityError extends ItemError {}

export interface SecurityError extends ItemError {}

export interface PersistenceError extends ItemError {}

export interface ItemMeta {
  state: State
  validity: Validity
  security: Security
  persistence: Persistence
  validityErrors?: ValidityError[]
  securityErrors?: SecurityError[]
  persistenceErrors?: PersistenceError[]
}

export enum State {
   OK = 'OK',
   ERROR = 'ERROR'
}

export enum Validity { VALID = 'VALID', INVALID = 'INVALID', UNKNOWN = 'UNKNOWN' }
export enum Security { ALLOWED = 'ALLOWED', FORBIDDEN = 'FORBIDDEN', UNKNOWN = 'UNKNOWN' }
export enum Persistence { NEW = 'NEW', DIRTY = 'DIRTY', SAVED = 'SAVED', SAVE_ERROR = 'SAVE_ERROR' }

export type FromOzone<T extends Item> = T & {
  id: UUID
  version: UUID
  _meta: ItemMeta
  tenant: UUID
  type:string
}

export class Item {
  constructor (src?: Item) {
    if (src) {
      this.id = src.id
      this.version = src.version
      this.type = src.type
      this._meta = src._meta
      this.name = src.name
      this.deleted = src.deleted
      this.traits = src.traits
      this.tenant = src.tenant
      this.creationUser = src.creationUser
      this.modificationUser = src.modificationUser
    }
  }

  id?: UUID
  version?: UUID
  type?:string
  _meta?: ItemMeta
  name?: string
  deleted?: boolean
  traits?: string[]
  tenant?: UUID
  creationUser?: UUID
  modificationUser?: UUID
}

export class GenericItem extends Item {
  [key: string]: any;
}

export function OzoneType(typeIdentifier:string) {
  return function <T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
      type = typeIdentifier
    }
  }
}