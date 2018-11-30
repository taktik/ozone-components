import { RestrictedContent } from './RestrictedContent'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('gui')
export class Gui extends Item implements RestrictedContent {
	guiUuid: UUID | null
	i18n: string | null
	indexHi: number | null
	indexLow: number | null
	inheritedFrom: UUID | null
	onlyShowIfAssetsAvailable: boolean | null
	packages: string[] | null
	parent: UUID | null
	restricted: boolean | null
	tags: string[] | null

	constructor(src: Gui) {
		super(src)
		this.guiUuid = src.guiUuid
		this.i18n = src.i18n
		this.indexHi = src.indexHi
		this.indexLow = src.indexLow
		this.inheritedFrom = src.inheritedFrom
		this.onlyShowIfAssetsAvailable = src.onlyShowIfAssetsAvailable
		this.packages = src.packages
		this.parent = src.parent
		this.restricted = src.restricted
		this.tags = src.tags
	}
}
