import { DeviceMessageReply } from './DeviceMessageReply'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("device.message.takescreenshotreply")
export class DeviceMessageTakescreenshotreply extends DeviceMessageReply { 
        screenshots?: UUID[]

	constructor(src:DeviceMessageTakescreenshotreply) { 
		super(src)
		this.screenshots = src.screenshots
	}
}
