

export type UUID = string
export type Instant = string

export class ItemError {
  fields?: [string]
  message?: string
}

export class ValidityError extends ItemError {}

export class SecurityError extends ItemError {}

export class PersistenceError extends ItemError {}

export class ItemMeta {
  state?: State
  validity?: Validity
  security?: Security
  persistence?: Persistence
  validityErrors?: [ValidityError]
  securityErrors?: [SecurityError]
  persistenceErrors?: [PersistenceError]
}

export enum State {
   OK = 'OK',
   ERROR = 'ERROR'
}

export enum Validity { VALID = 'VALID', INVALID = 'INVALID', UNKNOWN = 'UNKNOWN' }
export enum Security { ALLOWED = 'ALLOWED', FORBIDDEN = 'FORBIDDEN', UNKNOWN = 'UNKNOWN' }
export enum Persistence { NEW = 'NEW', DIRTY = 'DIRTY', SAVED = 'SAVED', SAVE_ERROR = 'SAVE_ERROR' }

export class Item {
  id: UUID
  version: UUID
  type: string
  _meta: ItemMeta
  name?: string
  deleted?: boolean
  traits?: [string]
  tenant: UUID
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