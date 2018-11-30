import {Item, UUID, Instant, OzoneType} from './Item'

export interface FlowrMedia {
	localizedDescription: { [key: string]: string; } | null
	localizedName: { [key: string]: string; } | null
	localizedShortDescription: { [key: string]: string; } | null
	localizedTitle: { [key: string]: string; } | null
	mediaUuid: UUID | null
	usage: string | null
}
