import { DeviceInfo } from './DeviceInfo'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('input.device')
export class InputDevice extends DeviceInfo {
	targetDevice: UUID | null

	constructor(src: InputDevice) {
		super(src)
		this.targetDevice = src.targetDevice
	}
}
