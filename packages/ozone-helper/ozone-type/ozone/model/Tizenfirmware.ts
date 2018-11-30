import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('tizenfirmware')
export class Tizenfirmware extends Item {
	binary: UUID | null
	description: string | null
	fileName: string | null
	size_byte: number | null
	swVersion: string | null

	constructor(src: Tizenfirmware) {
		super(src)
		this.binary = src.binary
		this.description = src.description
		this.fileName = src.fileName
		this.size_byte = src.size_byte
		this.swVersion = src.swVersion
	}
}
