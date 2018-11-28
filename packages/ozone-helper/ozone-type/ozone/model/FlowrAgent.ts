import { Principal } from './Principal'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("flowr.agent")
export class FlowrAgent extends Item implements Principal { 
   lastLoginDate?: Instant
   lastLoginIpAddress?: string
   network: UUID
   networks: [UUID]
   principalName: string
   roles?: [UUID]
   secret?: string
   websocketUrl?: string
 } 
