import { Item } from '../Item'
import { Principal } from '../Principal'

export class SipServer extends Item implements Principal {
	ipAddress: string
	secret: string
	plainSecret: string
	port: number
	extensionsPrefix?: string
	lastModificationDate?: string

	constructor(src: SipServer) {
		super(src)
		this.secret = src.secret
		this.ipAddress = src.ipAddress
		this.plainSecret = src.plainSecret
		this.port = src.port
		this.extensionsPrefix = src.extensionsPrefix
		this.lastModificationDate = src.lastModificationDate
	}
}
