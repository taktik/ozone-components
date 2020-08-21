import { DeviceMessage } from './DeviceMessage'
import {OzoneType, UUID} from './Item'

export const WARNING_STATES = Object.freeze( {
	OFF: 0,
	ON: 1,
	TEST: -1
})

@OzoneType('device.message.warning')
export class DeviceMessageWarning extends DeviceMessage {
	state: Number
	building: UUID

	constructor(src:DeviceMessageWarning) {
		super(src);
		this.state = src.state
		this.building = src.building
	}
}
