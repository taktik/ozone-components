import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('article')
export class Article extends Item {
	category: UUID | null
	description: { [key: string]: string; } | null
	index: number | null
	localizedName: { [key: string]: string; } | null
	logo: UUID | null
	price: number | null

	constructor(src: Article) {
		super(src)
		this.category = src.category
		this.description = src.description
		this.index = src.index
		this.localizedName = src.localizedName
		this.logo = src.logo
		this.price = src.price
	}
}
