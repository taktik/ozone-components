import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('documenttemplate')
export class Documenttemplate extends Item {
	destination: string | null
	template: string | null

	constructor(src: Documenttemplate) {
		super(src)
		this.destination = src.destination
		this.template = src.template
	}
}
