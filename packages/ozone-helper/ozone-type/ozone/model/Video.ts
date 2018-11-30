import { FlowrLogoitem } from './FlowrLogoitem'
import { FlowrVod } from './FlowrVod'
import { Media } from './Media'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('video')
export class Video extends Media implements FlowrLogoitem, FlowrVod {
	actors: string | null
	editors: string | null
	episodeNumber: number | null
	genre: string | null
	groupingId: string | null
	highlight: boolean | null
	highlightLogo: UUID | null
	language: string | null
	logo: UUID | null
	parentalGuidance: number | null
	presentators: string | null
	realisators: string | null
	seasonNumber: number | null
	subTitle: { [key: string]: string; } | null
	vodType: string | null
	year: number | null

	constructor(src: Video) {
		super(src)
		this.actors = src.actors
		this.editors = src.editors
		this.episodeNumber = src.episodeNumber
		this.genre = src.genre
		this.groupingId = src.groupingId
		this.highlight = src.highlight
		this.highlightLogo = src.highlightLogo
		this.language = src.language
		this.logo = src.logo
		this.parentalGuidance = src.parentalGuidance
		this.presentators = src.presentators
		this.realisators = src.realisators
		this.seasonNumber = src.seasonNumber
		this.subTitle = src.subTitle
		this.vodType = src.vodType
		this.year = src.year
	}
}
