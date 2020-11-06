import { Instant, Item, OzoneType, UUID } from './Item'
import { isLocationBuilding, LocationBuilding } from './LocationBuilding'
import { FlowrWarningOperator } from './FlowrWarningOperator'
import { isLocationSite, LocationSite } from './LocationSite'

export enum LOG_ACTION {
	LOGIN = 'LOGIN',
	LOGOUT = 'LOGOUT',
	SWITCH_SITE = 'SWITCH_SITE',
	WARNING_ON = 'WARNING_ON',
	WARNING_OFF = 'WARNING_OFF',
	WARNING_TEST = 'WARNING_TEST'
}

@OzoneType('flowr.warning.log')
export class FlowrWarningLog extends Item {

	date: Instant
	operator: UUID
	action: LOG_ACTION
	targetType?: String
	target?: UUID

	constructor(src: FlowrWarningLog) {
		super(src)
		this.date = src.date
		this.operator = src.operator
		this.action = src.action
		this.targetType = src.targetType
		this.target = src.target
	}
}

export class HydratedFlowrWarningLog {
	id: UUID
	type: string
	date: Instant
	operator: FlowrWarningOperator
	action: LOG_ACTION
	targetType?: String
	target?: LocationBuilding | LocationSite

	constructor(src: any) { // can't type HydratedFlowrWarningLog else src has to have getTargetToString function
		this.type = 'flowr.warning.log'
		this.id = src.id
		this.date = src.date
		this.operator = src.operator
		this.action = src.action
		this.targetType = src.targetType
		this.target = src.target
	}

	getTargetToString() {
		if (!this.target) return
		if (isLocationSite(this.target)) {
			return this.target.name
		} else if (isLocationBuilding(this.target)) {
			return this.target.warningButtonText
		}
		return
	}
}

export const isFlowrWarningLog = (object: any): object is FlowrWarningLog => {
	return object.type === 'flowr.warning.log'
}

export const isHydratedFlowrWarningLog = (object: any): object is HydratedFlowrWarningLog => {
	return object.type === 'flowr.warning.log' && (object.target === undefined || typeof (object.target) === 'object')
}
