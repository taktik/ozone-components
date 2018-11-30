import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('flowr.doctemplate')
export class FlowrDoctemplate extends Item {
	attachmentName: string | null
	attachmentTemplate: string | null
	bodyTemplate: string | null
	destination: string | null
	identifier: string | null
	language: string | null
	subjectTemplate: string | null

	constructor(src: FlowrDoctemplate) {
		super(src)
		this.attachmentName = src.attachmentName
		this.attachmentTemplate = src.attachmentTemplate
		this.bodyTemplate = src.bodyTemplate
		this.destination = src.destination
		this.identifier = src.identifier
		this.language = src.language
		this.subjectTemplate = src.subjectTemplate
	}
}
