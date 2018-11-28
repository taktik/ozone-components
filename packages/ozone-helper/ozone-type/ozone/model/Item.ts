export type UUID = string
export type Instant = string

export class ItemError {
  fields?: [string]
  message?: string
}

export class ValidityError extends ItemError {}

export class SecurityError extends ItemError {}

export class PersistenceError extends ItemError {}

export class ItemMeta {
  state?: State
  validity?: Validity
  security?: Security
  persistence?: Persistence
  validityErrors?: [ValidityError]
  securityErrors?: [SecurityError]
  persistenceErrors?: [PersistenceError]
}

export enum State {
   OK = 'OK',
   ERROR = 'ERROR'
}

export enum Validity { VALID = 'VALID', INVALID = 'INVALID', UNKNOWN = 'UNKNOWN' }
export enum Security { ALLOWED = 'ALLOWED', FORBIDDEN = 'FORBIDDEN', UNKNOWN = 'UNKNOWN' }
export enum Persistence { NEW = 'NEW', DIRTY = 'DIRTY', SAVED = 'SAVED', SAVE_ERROR = 'SAVE_ERROR' }

export class Item {
  id?: UUID
  version?: UUID
  type?: string
  meta?: ItemMeta
  name?: string
  deleted?: boolean
  traits?: [string]
  tenant?: UUID
  creationUser?: UUID
  modificationUser?: UUID
}

export function OzoneType(typeIdentifier:string) {
  return function <T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
      type = typeIdentifier
    }
  }
}
export * from './Media'
export * from './Basket'
export * from './DeviceMessage'
export * from './DeviceMessageEnablevorlon'
export * from './RestrictedContent'
export * from './Channel'
export * from './FlowrLogoitem'
export * from './ChannelOutput'
export * from './ChannelInput'
export * from './FlowrFrontendSettings'
export * from './FlowrGeolocation'
export * from './ServiceInfo'
export * from './DeviceMessageLogs'
export * from './OrganizationInfo'
export * from './DeviceMessageReply'
export * from './DeviceMessageTakescreenshotreply'
export * from './Principal'
export * from './DeviceInfo'
export * from './Reservation'
export * from './Metric'
export * from './LongTaskTimer'
export * from './DeviceMessageReboot'
export * from './Gauge'
export * from './ChannelInputRtmp'
export * from './SubscriptionAction'
export * from './FlowrGrantcontent'
export * from './TimestampedItem'
export * from './Recording'
export * from './Flowrecording'
export * from './InputDevice'
export * from './Joystick'
export * from './LogItem'
export * from './DeviceMessageAlert'
export * from './DeviceEvent'
export * from './DeviceMessageEvent'
export * from './Folder'
export * from './Postingindex'
export * from './DeviceMessageTurnoff'
export * from './Gui'
export * from './DeviceMessageEmail'
export * from './ChannelOutputRecording'
export * from './FunctionCounter'
export * from './File'
export * from './PlaylistFolder'
export * from './DeviceFirmware'
export * from './Document'
export * from './SurveyResponse'
export * from './EshopOrder'
export * from './Tizenfirmware'
export * from './Subscription'
export * from './FlowrDoctemplate'
export * from './DnsRecord'
export * from './ArticleCategory'
export * from './DeviceMessageMessagedeleted'
export * from './Audio'
export * from './DeviceMessageTicketingTicket'
export * from './DeviceMessageTicketingVisitor'
export * from './Event'
export * from './DeviceMessageTicketing'
export * from './DeviceAction'
export * from './FlowrAgent'
export * from './FlowrVod'
export * from './ChannelInputScreencast'
export * from './DeviceActionEvent'
export * from './ChannelSegment'
export * from './DeviceMessageKeypress'
export * from './Externalmedia'
export * from './SurveyCategory'
export * from './ChannelTranscoding'
export * from './Flowrconfig'
export * from './FunctionTimer'
export * from './FlowrScenesdisplay'
export * from './Externalvideo'
export * from './Video'
export * from './DeviceMessageFromdevice'
export * from './DeviceActionTurnon'
export * from './DeviceActionChangetenant'
export * from './DeviceMessageForcechannel'
export * from './Stock'
export * from './Image'
export * from './FlowrMediaplay'
export * from './Batch'
export * from './Collection'
export * from './DnsService'
export * from './ListModel'
export * from './Article'
export * from './Passingtime'
export * from './ChannelInputMulticast'
export * from './FlowrEpg'
export * from './Survey'
export * from './DeviceMessageTakescreenshot'
export * from './ChannelOutputStreaming'
export * from './DeviceFirmwareTizen'
export * from './TagsCustom'
export * from './FlowrMedia'
export * from './Network'
export * from './DeviceMessageNotice'
export * from './DeviceMessageReload'
export * from './Timer'
export * from './Playlist'
export * from './Counter'
export * from './Message'
export * from './Room'
export * from './Vehicleposition'
export * from './DeviceMessageRefresh'
export * from './DeviceMessageUpdate'
export * from './TimeGauge'
export * from './Documenttemplate'
export * from './DistributionSummary'