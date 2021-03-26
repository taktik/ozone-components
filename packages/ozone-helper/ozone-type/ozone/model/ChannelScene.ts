import { Item, OzoneType, UUID } from './Item'
import { ChannelSceneRecurrence } from './ChannelSceneRecurrence'

@OzoneType('flowr.channel.scene')
export class ChannelScene extends Item {
	gui?: UUID
	uuid?: UUID
	color?: string
	startDate?: Number
	stopDate?: Number
	startTime?: string
	stopTime?: string
	recurrence?: ChannelSceneRecurrence

	constructor(src: ChannelScene) {
		super(src)
		this.gui = src.gui
		this.uuid = src.uuid
		this.color = src.color
		this.startDate = src.startDate
		this.stopDate = src.stopDate
		this.startTime = src.startTime
		this.stopTime = src.stopTime
		this.recurrence = src.recurrence
	}
}
