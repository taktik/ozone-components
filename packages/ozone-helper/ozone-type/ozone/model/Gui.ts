import { RestrictedContent } from './RestrictedContent'

import { Item, UUID, Instant, OzoneType } from './Item'

@OzoneType('gui')
export class Gui extends Item implements RestrictedContent {
	guiUuid?: UUID
	i18n?: string
	indexHi?: number
	indexLow?: number
	inheritedFrom?: UUID
	onlyShowIfAssetsAvailable?: boolean
	packages?: string[]
	parent?: UUID
	restricted?: boolean
	tags?: string[]

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
