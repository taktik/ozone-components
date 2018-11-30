import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('survey')
export class Survey extends Item {
	category: UUID | null
	index: number | null
	question: { [key: string]: string; } | null

	constructor(src: Survey) {
		super(src)
		this.category = src.category
		this.index = src.index
		this.question = src.question
	}
}
