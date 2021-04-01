import { Item } from '../Item'
import { Principal } from '../Principal'

export class SipServer extends Item implements Principal {
	ipAddress: string
	secret: string
	plainSecret: string
	port: number
	extensionsPrefix?: string
	lastModificationDate?: string
	trunkDomain: string
	trunkPort?: number
	trunkUsername?: string
	trunkPassword?: string
	trunkDirection: SipTrunkDirection
	roles?: any[]

	constructor(src: SipServer) {
		super(src)
		this.secret = src.secret
		this.ipAddress = src.ipAddress
		this.plainSecret = src.plainSecret
		this.port = src.port
		this.extensionsPrefix = src.extensionsPrefix
		this.lastModificationDate = src.lastModificationDate
		this.trunkDomain = src.trunkDomain
		this.trunkPort = src.trunkPort
		this.trunkUsername = src.trunkUsername
		this.trunkPassword = src.trunkPassword
		this.trunkDirection = src.trunkDirection
		this.roles = src.roles
	}
}

export enum SipTrunkDirection {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING'
}
