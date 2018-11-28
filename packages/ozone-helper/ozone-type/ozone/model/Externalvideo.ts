import { Externalmedia } from './Externalmedia'
import { Video } from './Video'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("externalvideo")
export class Externalvideo extends Video implements Externalmedia { 
   externalDate?: Instant
   externalId?: string
   externalSource?: string
   externalURL?: string
   externalValidityDate?: Instant
 } 
