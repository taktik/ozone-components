import { Item, OzoneType } from './Item'

@OzoneType('flowr.connect.tv.user')
export class FlowrConnectTvUser extends Item {
	lastActivityTimestampMs?: string
	linkedTV?: string

	constructor(src: FlowrConnectTvUser) {
		super(src)
		this.lastActivityTimestampMs = src.lastActivityTimestampMs
		this.linkedTV = src.linkedTV
	}
}
