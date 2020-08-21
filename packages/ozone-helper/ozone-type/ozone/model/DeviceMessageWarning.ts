import { DeviceMessage } from './DeviceMessage'
import {OzoneType, UUID} from './Item'

export enum WARNING_STATES {
	OFF = "off",
	ON = "on",
	TEST = "test"
}

@OzoneType('device.message.warning')
export class DeviceMessageWarning extends DeviceMessage {
	state: WARNING_STATES
	building: UUID

	constructor(src:DeviceMessageWarning) {
		super(src);
		this.state = src.state
		this.building = src.building
	}
}
