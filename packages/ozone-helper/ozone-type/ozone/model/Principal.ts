import {Item, UUID, Instant, OzoneType} from './Item'

export interface Principal {
	lastLoginDate: Instant | null
	lastLoginIpAddress: string | null
	roles: UUID[] | null
	secret: string | null
}
