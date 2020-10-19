import {Item, OzoneType, UUID} from "./Item";
import {Principal} from "./Principal";
import {FlowrWarningParsable} from "./FlowrWarningParsable";

@OzoneType('flowr.warning.operator')
export class FlowrWarningOperator extends Item implements Principal, FlowrWarningParsable {
	login: string
	secret: string
	plainPassword: string
	roles?: UUID[]

	constructor(src: FlowrWarningOperator) {
		super(src)
		this.login = src.login
		this.secret = src.secret
		this.plainPassword = src.plainPassword
	}
}

export class PersistedFlowrWarningOperator extends FlowrWarningOperator {
	id: string
	constructor(src:PersistedFlowrWarningOperator) {
		super(src);
		this.id = src.id
	}
}
