import { UUID } from '../Item'
import { Call } from '../Call'

export class SipCall extends Call {
	receptionDate: string
	callDirection: CallDirection
	response?: SipCallResponse
	sipExtensionId: UUID

	constructor(src: SipCall) {
		super(src)
		this.receptionDate = src.receptionDate
		this.callDirection = src.callDirection
		this.response = src.response
		this.sipExtensionId = src.sipExtensionId
	}
}

export enum CallDirection {
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING'
}

export enum SipCallResponse {
	ACCEPT = 'ACCEPT',
	REFUSE = 'REFUSE',
	IGNORE = 'IGNORE'
}

export function isSipCall(call: Call): call is SipCall {
	return !!(call as SipCall).sipExtensionId
}
