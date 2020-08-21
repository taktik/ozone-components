import {Item, OzoneType} from "./Item";
import {Principal} from "./Principal";

@OzoneType('flowr.warning.operator')
export default class FlowrWarningOperator extends Item implements Principal {
	login: string
	secret: string

	constructor(src: FlowrWarningOperator) {
		super(src)
		this.login = src.login
		this.secret = src.secret
	}
}
