import { FlowrMedia } from './FlowrMedia'
import { RestrictedContent } from './RestrictedContent'
import { TagsCustom } from './TagsCustom'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("media")
export class Media extends Item implements TagsCustom, FlowrMedia, RestrictedContent { 
   byLine?: string
   caption?: string
   category?: string
   city?: string
   collections?: [UUID]
   country?: string
   creationDate?: Instant
   credit?: string
   date?: Instant
   derivedFiles?: [UUID]
   file?: UUID
   fileUTI?: [string]
   fullText?: UUID
   height?: number
   indexed_fulltext?: string
   keywords?: [string]
   length?: number
   localizedDescription?: { [key: string]: string; }
   localizedName?: { [key: string]: string; }
   localizedShortDescription?: { [key: string]: string; }
   localizedTitle?: { [key: string]: string; }
   mediaUuid?: UUID
   modificationDate?: Instant
   objectName?: string
   parentFolder?: UUID
   previewDate?: Instant
   previewRatio?: number
   publications?: [string]
   representedBy?: UUID
   restricted: boolean
   source?: string
   specialInstructions?: string
   status?: string
   stocks?: [UUID]
   title?: string
   usage?: string
   width?: number
 } 
