import { UUID } from 'ozone-type/ozone/model/Item'

import { DeviceMessage } from './DeviceMessage'
import { OzoneType } from './Item'

export enum Level {
	ALL,
	TRACE,
	DEBUG,
	INFO,
	WARN,
	ERROR,
	FATAL,
	OFF
}

interface IParams {
	postingId?: UUID
	ttl?: number
	level: Level
}

@OzoneType('device.message.setloglevel')
export class DeviceMessageSetLogLevel extends DeviceMessage {
	level: string // must be a string to send it to the backend

	constructor(src: IParams) {
		super(src)
		this.level = Level[src.level]
	} 
}
