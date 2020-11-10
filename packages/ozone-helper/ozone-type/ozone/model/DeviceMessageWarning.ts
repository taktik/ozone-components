import { DeviceMessage } from './DeviceMessage'
import { OzoneType, UUID } from './Item'

export enum WARNING_STATES {
	OFF = 'OFF',
	ON = 'ON',
	TEST = 'TEST'
}

@OzoneType('device.message.warning')
export class DeviceMessageWarning extends DeviceMessage {
	state: WARNING_STATES
	building: UUID
	wokenUp?: boolean

	constructor(src: DeviceMessageWarning) {
		super(src)
		this.state = src.state
		this.building = src.building
		this.wokenUp = src.wokenUp
	}
}
