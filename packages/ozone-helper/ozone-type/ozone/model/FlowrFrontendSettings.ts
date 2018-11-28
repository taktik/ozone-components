import { FlowrGeolocation } from './FlowrGeolocation'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.frontend.settings")
export class FlowrFrontendSettings extends Item { 
   audioLanguage?: string
   autoUpdate?: boolean
   bootPageId?: UUID
   interfaceLanguage?: string
   lastChannelId?: UUID
   location?: FlowrGeolocation
   maxVolume?: number
   preferredContent?: [UUID]
   startVolume?: number
   subtitlesLanguage?: string
   user?: UUID
 } 
