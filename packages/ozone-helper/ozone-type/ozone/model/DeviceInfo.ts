import { FlowrFrontendSettings } from './FlowrFrontendSettings'
import { Principal } from './Principal'

import { Item, UUID, Instant, OzoneType } from './Item'

@OzoneType('device.info')
export class DeviceInfo extends Item implements Principal {
	activeMacAddress?: string
	deviceType?: string
	deviceVersion?: string
	extraInformation?: string[]
	frontendSettings?: FlowrFrontendSettings
	frontendVersion?: string
	lastLoginDate?: Instant
	lastLoginIpAddress?: string
	linkedUser?: UUID
	location?: string
	macAddress?: string
	model?: string
	network?: UUID
	principalName?: string
	roles?: UUID[]
	secret?: string
	serialNumber?: string
	status?: string
	subLocation?: string
	validMacAddress?: string

	constructor(src: DeviceInfo) {
		super(src)
		this.activeMacAddress = src.activeMacAddress
		this.deviceType = src.deviceType
		this.deviceVersion = src.deviceVersion
		this.extraInformation = src.extraInformation
		this.frontendSettings = src.frontendSettings
		this.frontendVersion = src.frontendVersion
		this.lastLoginDate = src.lastLoginDate
		this.lastLoginIpAddress = src.lastLoginIpAddress
		this.linkedUser = src.linkedUser
		this.location = src.location
		this.macAddress = src.macAddress
		this.model = src.model
		this.network = src.network
		this.principalName = src.principalName
		this.roles = src.roles
		this.secret = src.secret
		this.serialNumber = src.serialNumber
		this.status = src.status
		this.subLocation = src.subLocation
		this.validMacAddress = src.validMacAddress
	}
}
