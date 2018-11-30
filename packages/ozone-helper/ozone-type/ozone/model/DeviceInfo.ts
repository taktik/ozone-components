import { FlowrFrontendSettings } from './FlowrFrontendSettings'
import { Principal } from './Principal'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('device.info')
export class DeviceInfo extends Item implements Principal {
	activeMacAddress: string | null
	deviceType: string | null
	deviceVersion: string | null
	extraInformation: string[] | null
	frontendSettings: FlowrFrontendSettings | null
	frontendVersion: string | null
	lastLoginDate: Instant | null
	lastLoginIpAddress: string | null
	linkedUser: UUID | null
	location: string | null
	macAddress: string | null
	model: string | null
	network: UUID | null
	principalName: string | null
	roles: UUID[] | null
	secret: string | null
	serialNumber: string | null
	status: string | null
	subLocation: string | null
	validMacAddress: string | null

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
