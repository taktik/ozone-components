import { Media } from './Media'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("list")
export class ListModel extends Media { 
   listItems?: [UUID]
 } 
