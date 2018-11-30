import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('survey.category')
export class SurveyCategory extends Item {
	description: { [key: string]: string; } | null
	localizedName: { [key: string]: string; } | null

	constructor(src: SurveyCategory) {
		super(src)
		this.description = src.description
		this.localizedName = src.localizedName
	}
}
