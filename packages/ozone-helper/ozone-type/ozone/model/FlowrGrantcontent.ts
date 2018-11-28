import { SubscriptionAction } from './SubscriptionAction'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.grantcontent")
export class FlowrGrantcontent extends SubscriptionAction { 
   actionRoles?: [string]
   tags?: [string]
   unlimitedRights: boolean
 } 
