import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('device.firmware')
export class DeviceFirmware extends Item {
	binary: UUID | null
	byteSize: number | null
	description: string | null
	fileName: string | null
	softwareVersion: string | null

	constructor(src: DeviceFirmware) {
		super(src)
		this.binary = src.binary
		this.byteSize = src.byteSize
		this.description = src.description
		this.fileName = src.fileName
		this.softwareVersion = src.softwareVersion
	}
}
