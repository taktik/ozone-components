                           export type UUID = string
                           export type Instant = string

                           export interface ItemError {
                             fields?: string[]
                             message?: string
                           }

                           export interface ValidityError extends ItemError {}

                           export interface SecurityError extends ItemError {}

                           export interface PersistenceError extends ItemError {}

                           export interface ItemMeta {
                             state: State
                             validity: Validity
                             security: Security
                             persistence: Persistence
                             validityErrors?: ValidityError[]
                             securityErrors?: SecurityError[]
                             persistenceErrors?: PersistenceError[]
                           }

                           export enum State {
                              OK = 'OK',
                              ERROR = 'ERROR'
                           }

                           export enum Validity { VALID = 'VALID', INVALID = 'INVALID', UNKNOWN = 'UNKNOWN' }
                           export enum Security { ALLOWED = 'ALLOWED', FORBIDDEN = 'FORBIDDEN', UNKNOWN = 'UNKNOWN' }
                           export enum Persistence { NEW = 'NEW', DIRTY = 'DIRTY', SAVED = 'SAVED', SAVE_ERROR = 'SAVE_ERROR' }

                           export type FromOzone<T extends Item> = T & {
                             id: UUID
                             version: UUID
                             _meta: ItemMeta
                             tenant: UUID
                             type:string
                           }

                           export type Patch<T> = {
[P in keyof T]?: T[P] | null;
                           }

                           @OzoneType('item')
                           export class Item {
                             constructor (src?: Item) {
                               if (src) {
                                 this.id = src.id
                                 this.version = src.version
                                 this.type = src.type
                                 this._meta = src._meta
                                 this.name = src.name
                                 this.deleted = src.deleted
                                 this.traits = src.traits
                                 this.tenant = src.tenant
                                 this.creationUser = src.creationUser
                                 this.modificationUser = src.modificationUser
                               }
                             }

                             id?: UUID
                             version?: UUID
                             type?:string
                             _meta?: ItemMeta
                             name?: string
                             deleted?: boolean
                             traits?: string[]
                             tenant?: UUID
                             creationUser?: UUID
                             modificationUser?: UUID
                           }

                           export class GenericItem extends Item {
                             [key: string]: any;
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
export * from './FlowrPackageable'
export * from './FlowrTransient'
export * from './ChannelOutput'
export * from './ChannelInput'
export * from './FlowrFrontendSettings'
export * from './FlowrDisplaySettings'
export * from './FlowrCecSettings'
export * from './FlowrRemoteControlSettings'
export * from './FlowrGeolocation'
export * from './ServiceInfo'
export * from './DeviceMessageLogs'
export * from './DeviceMessageTurnon'
export * from './OrganizationInfo'
export * from './DeviceMessageReply'
export * from './DeviceMessageTakescreenshotreply'
export * from './Principal'
export * from './DeviceInfo'
export * from './FlowrPackage'
export * from './Reservation'
export * from './FlowrEventSchedule'
export * from './FlowrEventScheduleDate'
export * from './Metric'
export * from './LongTaskTimer'
export * from './DeviceMessageReboot'
export * from './Gauge'
export * from './ChannelInputRtmp'
export * from './DeviceMessageClearnavigationdata'
export * from './SubscriptionAction'
export * from './FlowrGrantcontent'
export * from './TimestampedItem'
export * from './Recording'
export * from './Flowrecording'
export * from './InputDevice'
export * from './Joystick'
export * from './DeviceMessageFromdevice'
export * from './DeviceMessageSetfocus'
export * from './LogItem'
export * from './DeviceMessageAlert'
export * from './DeviceEvent'
export * from './DeviceMessageEvent'
export * from './Folder'
export * from './Postingindex'
export * from './DeviceMessageTurnoff'
export * from './FlowrApplication'
export * from './FlowrApplicationAuthor'
export * from './Gui'
export * from './DeviceMessageEmail'
export * from './FlowrEventScheduleCron'
export * from './DeviceMessageAlarm'
export * from './ChannelOutputRecording'
export * from './FunctionCounter'
export * from './File'
export * from './PlaylistFolder'
export * from './DeviceFirmware'
export * from './Document'
export * from './DeviceMessageCapturedomreply'
export * from './SurveyResponse'
export * from './EshopOrder'
export * from './Tizenfirmware'
export * from './FlowrEventScheduleDeviceAlarm'
export * from './Subscription'
export * from './FlowrDoctemplate'
export * from './DnsRecord'
export * from './ArticleCategory'
export * from './DeviceMessageMessagedeleted'
export * from './FlowrApplicationCapabilityRestriction'
export * from './FlowrApplicationCapabilityTextRestriction'
export * from './Audio'
export * from './DeviceMessageCapturedom'
export * from './DeviceMessageTicketingTicket'
export * from './DeviceMessageTicketingVisitor'
export * from './Event'
export * from './FlowrApplicationCapability'
export * from './DeviceMessageTicketing'
export * from './DeviceAction'
export * from './FlowrAgent'
export * from './DeviceMessageUnlock'
export * from './FlowrVod'
export * from './ChannelInputScreencast'
export * from './FlowrTestCrawlerCrawlResult'
export * from './DeviceActionEvent'
export * from './DeviceMessageSetfocusreply'
export * from './FlowrApplicationElectron'
export * from './ChannelSegment'
export * from './DeviceMessageKeypress'
export * from './Externalmedia'
export * from './SurveyCategory'
export * from './ChannelTranscoding'
export * from './Flowrconfig'
export * from './FlowrTestCrawlerCaptureDiffResult'
export * from './FunctionTimer'
export * from './FlowrScenesdisplay'
export * from './FlowrApplicationPackageCapability'
export * from './DeviceMessageLock'
export * from './Externalvideo'
export * from './Video'
export * from './DeviceActionTurnon'
export * from './DeviceActionChangetenant'
export * from './FlowrApplicationCustom'
export * from './DeviceMessageForcechannel'
export * from './Stock'
export * from './Image'
export * from './FlowrMediaplay'
export * from './Batch'
export * from './Collection'
export * from './FlowrApplicationCapabilityPackageRestriction'
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
export * from './FlowrApplicationTextCapability'
export * from './Playlist'
export * from './FlowrTestCrawlerScreenCapture'
export * from './FlowrTestCrawlerOrganizationCrawl'
export * from './DeviceFirmwareBrightsign'
export * from './Counter'
export * from './Message'
export * from './Room'
export * from './Vehicleposition'
export * from './DeviceMessageRefresh'
export * from './DeviceMessageUpdate'
export * from './TimeGauge'
export * from './Documenttemplate'
export * from './DistributionSummary'