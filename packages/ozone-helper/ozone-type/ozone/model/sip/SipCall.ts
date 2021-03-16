import { UUID } from '../Item'
import { Call } from '../Call'

export class SipCall extends Call {
	receptionDate: string
	sipExtensionId: UUID

	constructor(src: SipCall) {
		super(src)
		this.receptionDate = src.receptionDate
		this.sipExtensionId = src.sipExtensionId
	}
}

export function isSipCall(call: Call): call is SipCall {
	return !!(call as SipCall).sipExtensionId
}
