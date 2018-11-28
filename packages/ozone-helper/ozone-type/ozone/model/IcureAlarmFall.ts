import { ServiceInfo } from './ServiceInfo'
import { TimestampedItem } from './TimestampedItem'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("icure.alarm.fall")
export class IcureAlarmFall extends TimestampedItem implements ServiceInfo { 
   instanceId: string
   properties?: { [key: string]:string; }
   replicaId?: string
   serviceName?: string
 } 
