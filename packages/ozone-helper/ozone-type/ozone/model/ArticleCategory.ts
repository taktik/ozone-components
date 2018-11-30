import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('article.category')
export class ArticleCategory extends Item {
	description: { [key: string]: string; } | null
	localizedName: { [key: string]: string; } | null

	constructor(src: ArticleCategory) {
		super(src)
		this.description = src.description
		this.localizedName = src.localizedName
	}
}
