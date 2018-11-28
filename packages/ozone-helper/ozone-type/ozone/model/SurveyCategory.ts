import {Item, UUID, Instant, OzoneType} from './Item'

@OzoneType("survey.category")
export class SurveyCategory extends Item { 
   description?: { [key: string]: string; }
   localizedName?: { [key: string]: string; }
 } 
