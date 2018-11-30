import { Event } from './Event'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('device.event')
export class DeviceEvent extends Event {
	devices: UUID[] | null
	network: UUID | null

	constructor(src: DeviceEvent) {
		super(src)
		this.devices = src.devices
		this.network = src.network
	}
}
