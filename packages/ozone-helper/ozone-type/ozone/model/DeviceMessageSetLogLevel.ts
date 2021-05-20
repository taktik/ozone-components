import { DeviceMessage } from './DeviceMessage'

import { OzoneType } from './Item'

@OzoneType('device.message.setloglevel')
export class DeviceMessageSetLogLevel extends DeviceMessage {
	level: string

	constructor(src: DeviceMessageSetLogLevel) {
		super(src)
		this.level = src.level
	}
}
