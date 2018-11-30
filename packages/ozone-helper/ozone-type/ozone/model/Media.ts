import { FlowrMedia } from './FlowrMedia'
import { RestrictedContent } from './RestrictedContent'
import { TagsCustom } from './TagsCustom'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('media')
export class Media extends Item implements TagsCustom, FlowrMedia, RestrictedContent {
	byLine: string | null
	caption: string | null
	category: string | null
	city: string | null
	collections: UUID[] | null
	country: string | null
	creationDate: Instant | null
	credit: string | null
	date: Instant | null
	derivedFiles: UUID[] | null
	file: UUID | null
	fileUTI: string[] | null
	fullText: UUID | null
	height: number | null
	indexed_fulltext: string | null
	keywords: string[] | null
	length: number | null
	localizedDescription: { [key: string]: string; } | null
	localizedName: { [key: string]: string; } | null
	localizedShortDescription: { [key: string]: string; } | null
	localizedTitle: { [key: string]: string; } | null
	mediaUuid: UUID | null
	modificationDate: Instant | null
	objectName: string | null
	parentFolder: UUID | null
	previewDate: Instant | null
	previewRatio: number | null
	publications: string[] | null
	representedBy: UUID | null
	restricted: boolean | null
	source: string | null
	specialInstructions: string | null
	status: string | null
	stocks: UUID[] | null
	title: string | null
	usage: string | null
	width: number | null

	constructor(src: Media) {
		super(src)
		this.byLine = src.byLine
		this.caption = src.caption
		this.category = src.category
		this.city = src.city
		this.collections = src.collections
		this.country = src.country
		this.creationDate = src.creationDate
		this.credit = src.credit
		this.date = src.date
		this.derivedFiles = src.derivedFiles
		this.file = src.file
		this.fileUTI = src.fileUTI
		this.fullText = src.fullText
		this.height = src.height
		this.indexed_fulltext = src.indexed_fulltext
		this.keywords = src.keywords
		this.length = src.length
		this.localizedDescription = src.localizedDescription
		this.localizedName = src.localizedName
		this.localizedShortDescription = src.localizedShortDescription
		this.localizedTitle = src.localizedTitle
		this.mediaUuid = src.mediaUuid
		this.modificationDate = src.modificationDate
		this.objectName = src.objectName
		this.parentFolder = src.parentFolder
		this.previewDate = src.previewDate
		this.previewRatio = src.previewRatio
		this.publications = src.publications
		this.representedBy = src.representedBy
		this.restricted = src.restricted
		this.source = src.source
		this.specialInstructions = src.specialInstructions
		this.status = src.status
		this.stocks = src.stocks
		this.title = src.title
		this.usage = src.usage
		this.width = src.width
	}
}
