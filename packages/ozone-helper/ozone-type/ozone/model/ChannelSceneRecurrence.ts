import { Item, OzoneType } from './Item'

@OzoneType('flowr.channel.scene.recurrence')
export class ChannelSceneRecurrence extends Item {
	mode?: string
	weekDays?: Array<Number>
	months?: Array<Number>
	days?: Array<Number>
	color?: String

	constructor(src: ChannelSceneRecurrence) {
		super(src)
		this.mode = src.mode
		this.weekDays = src.weekDays
		this.months = src.months
		this.days = src.days
		this.color = src.color
	}
}
