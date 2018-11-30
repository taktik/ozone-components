import { Recording } from './Recording'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowrecording')
export class Flowrecording extends Recording {
	description: string | null
	deviceId: UUID
	summary: string | null
	thumbnail: string | null

	constructor(src: Flowrecording) {
		super(src)
		this.description = src.description
		this.deviceId = src.deviceId
		this.summary = src.summary
		this.thumbnail = src.thumbnail
	}
}
