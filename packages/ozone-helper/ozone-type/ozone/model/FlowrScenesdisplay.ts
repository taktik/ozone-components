import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.scenesdisplay")
export class FlowrScenesdisplay extends TimestampedItem implements ServiceInfo { 
   description?: string
   displayId?: UUID
   duration?: number
   instanceId: string
   itemId?: UUID
   properties?: { [key: string]:string; }
   replicaId?: string
   serviceName?: string
   userAgent?: string
 } 
