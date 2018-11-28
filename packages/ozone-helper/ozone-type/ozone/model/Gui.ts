import { RestrictedContent } from './RestrictedContent'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("gui")
export class Gui extends Item implements RestrictedContent { 
   guiUuid?: UUID
   i18n?: string
   indexHi?: number
   indexLow?: number
   inheritedFrom?: UUID
   onlyShowIfAssetsAvailable?: boolean
   packages?: [string]
   parent?: UUID
   restricted: boolean
   tags?: [string]
 } 
