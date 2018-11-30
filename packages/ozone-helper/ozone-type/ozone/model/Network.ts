import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('network')
export class Network extends Item {
	address: string
	dns: UUID | null
	netmask: string
	websocketUrl: string | null

	constructor(src: Network) {
		super(src)
		this.address = src.address
		this.dns = src.dns
		this.netmask = src.netmask
		this.websocketUrl = src.websocketUrl
	}
}
