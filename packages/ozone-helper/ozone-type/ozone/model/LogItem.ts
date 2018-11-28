import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("logItem")
export class LogItem extends TimestampedItem implements ServiceInfo { 
   category: string
   instanceId: string
   message: string
   properties?: { [key: string]:string; }
   replicaId?: string
   serviceName?: string
   severity: string
   stackTrace: string
   thread: string
 } 
