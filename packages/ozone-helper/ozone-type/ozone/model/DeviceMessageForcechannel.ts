import { DeviceMessage } from './DeviceMessage'

import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType('device.message.forcechannel')
export class DeviceMessageForcechannel extends DeviceMessage {
  itemId: string | null
  lang: string | null
  route: string
  sceneId: string | null
  volume: number | null

  constructor(src: DeviceMessageForcechannel) {
    super(src)
    this.itemId = src.itemId
    this.lang = src.lang
    this.route = src.route
    this.sceneId = src.sceneId
    this.volume = src.volume
  }
}
