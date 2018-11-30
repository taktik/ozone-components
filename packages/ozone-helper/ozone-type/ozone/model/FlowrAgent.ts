import { Principal } from './Principal'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowr.agent')
export class FlowrAgent extends Item implements Principal {
	lastLoginDate: Instant | null
	lastLoginIpAddress: string | null
	network: UUID
	networks: UUID[]
	principalName: string | null
	roles: UUID[] | null
	secret: string | null
	websocketUrl: string | null

	constructor(src: FlowrAgent) {
		super(src)
		this.lastLoginDate = src.lastLoginDate
		this.lastLoginIpAddress = src.lastLoginIpAddress
		this.network = src.network
		this.networks = src.networks
		this.principalName = src.principalName
		this.roles = src.roles
		this.secret = src.secret
		this.websocketUrl = src.websocketUrl
	}
}
