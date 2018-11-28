import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("survey.response")
export class SurveyResponse extends Item { 
   creationDate: Instant
   device: UUID
   lang: string
   response: string
   submitId: UUID
   survey: UUID
 } 
