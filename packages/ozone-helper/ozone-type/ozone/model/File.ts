import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('file')
export class File extends Item {
	blob: UUID | null
	fileType: UUID | null
	subFiles: { [key: string]:UUID; } | null
	uti: string | null
	utiHierarchy: string[] | null

	constructor(src: File) {
		super(src)
		this.blob = src.blob
		this.fileType = src.fileType
		this.subFiles = src.subFiles
		this.uti = src.uti
		this.utiHierarchy = src.utiHierarchy
	}
}
