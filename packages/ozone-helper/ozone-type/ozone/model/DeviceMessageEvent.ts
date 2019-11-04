import { DeviceEvent } from './DeviceEvent'
import { DeviceMessage } from './DeviceMessage'

import { Item, UUID, Instant, OzoneType } from './Item'

@OzoneType('device.message.event')
export class DeviceMessageEvent extends DeviceEvent {
	message: DeviceMessage
	users?: UUID[]
	shouldBeAcknowledged: boolean
	shouldWakeUpDevice: boolean

	constructor(src: DeviceMessageEvent) {
		super(src)
		this.message = src.message
		this.users = src.users
		this.shouldBeAcknowledged = src.shouldBeAcknowledged
		this.shouldWakeUpDevice = src.shouldWakeUpDevice
	}
}
