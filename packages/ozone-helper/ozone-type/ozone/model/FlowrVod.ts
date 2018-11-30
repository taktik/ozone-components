import {Item, UUID, Instant, OzoneType} from './Item'

export interface FlowrVod {
	actors: string | null
	editors: string | null
	episodeNumber: number | null
	genre: string | null
	groupingId: string | null
	highlight: boolean | null
	language: string | null
	parentalGuidance: number | null
	presentators: string | null
	realisators: string | null
	seasonNumber: number | null
	subTitle: { [key: string]: string; } | null
	vodType: string | null
	year: number | null
}
