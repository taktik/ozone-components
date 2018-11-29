import { Event } from './Event'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.event")
export class DeviceEvent extends Event { 
	devices?: [UUID]
	network?: UUID

	constructor(src:DeviceEvent) { 
		super(src)
		this.devices = src.devices
		this.network = src.network
	}
}
