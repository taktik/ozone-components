import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("metric")
export class Metric extends TimestampedItem implements ServiceInfo { 
   instanceId: string
   properties?: { [key: string]:string; }
   replicaId?: string
   serviceName?: string
   tags?: [string]
 } 
