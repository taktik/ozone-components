import { FlowrFrontendSettings } from './FlowrFrontendSettings'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('organization.info')
export class OrganizationInfo extends Item {
	frontendSettings: FlowrFrontendSettings | null
	rootGuiId: UUID | null
	secret: UUID | null
	settings: string | null
	signageGuiId: UUID | null
	storyboards: string | null

	constructor(src: OrganizationInfo) {
		super(src)
		this.frontendSettings = src.frontendSettings
		this.rootGuiId = src.rootGuiId
		this.secret = src.secret
		this.settings = src.settings
		this.signageGuiId = src.signageGuiId
		this.storyboards = src.storyboards
	}
}
