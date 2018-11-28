import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.mediaplay")
export class FlowrMediaplay extends TimestampedItem implements ServiceInfo { 
   description?: string
   effectivelyPlayedDuration?: number
   instanceId: string
   itemId?: UUID
   playId?: UUID
   properties?: { [key: string]:string; }
   ratioEffectiveTotal?: number
   replicaId?: string
   serviceName?: string
   totalDuration?: number
   url?: string
   userAgent?: string
 } 
