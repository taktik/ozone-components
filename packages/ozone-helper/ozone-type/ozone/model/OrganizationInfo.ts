import { FlowrFrontendSettings } from './FlowrFrontendSettings'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("organization.info")
export class OrganizationInfo extends Item { 
   frontendSettings?: FlowrFrontendSettings
   rootGuiId?: UUID
   secret?: UUID
   settings?: string
   signageGuiId?: UUID
   storyboards?: string
 } 
