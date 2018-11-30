import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('device.message.takescreenshot')
export class DeviceMessageTakescreenshot extends DeviceMessage {
	delay: number[] | null
	inputDeviceId: UUID
	screenshotId: string | null

	constructor(src: DeviceMessageTakescreenshot) {
		super(src)
		this.delay = src.delay
		this.inputDeviceId = src.inputDeviceId
		this.screenshotId = src.screenshotId
	}
}
