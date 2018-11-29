import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowrconfig")
export class Flowrconfig extends Item { 
	backendVersion?: number
	rootFolder?: UUID

	constructor(src:Flowrconfig) { 
		super(src)
		this.backendVersion = src.backendVersion
		this.rootFolder = src.rootFolder
	}
}
