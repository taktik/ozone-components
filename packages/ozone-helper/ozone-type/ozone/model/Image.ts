import { Media } from './Media'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('image')
export class Image extends Media {
	dpi: number | null

	constructor(src: Image) {
		super(src)
		this.dpi = src.dpi
	}
}
