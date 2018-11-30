import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('timestampedItem')
export class TimestampedItem extends Item {
	date: Instant | null

	constructor(src: TimestampedItem) {
		super(src)
		this.date = src.date
	}
}
