import { Item, OzoneType } from './Item'

@OzoneType('device.info')
export class FlowrConnectTvUser extends Item {
	lastActivityDate?: string

	constructor(src: FlowrConnectTvUser) {
		super(src)
		this.lastActivityDate = src.lastActivityDate
	}
}
