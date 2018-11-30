import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowr.geolocation')
export class FlowrGeolocation extends Item {
	address: string | null
	latitude: number | null
	longitude: number | null

	constructor(src: FlowrGeolocation) {
		super(src)
		this.address = src.address
		this.latitude = src.latitude
		this.longitude = src.longitude
	}
}
