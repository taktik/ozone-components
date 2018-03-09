import {OzoneAPIRequest} from 'ozone-api-request'
import {OzoneConfig} from 'ozone-config'
import * as uuid from 'uuid/v4'
import {Media} from 'ozone-type'



export interface MediaplayFormat {
    media:uuid,
    user: uuid,
    description?: string,
    userAgent: string,
}
export const ReportInterval_ms= 60 *1000;
const visitorId = uuid();
export class OzoneApiMediaplay{

    private recordUsage: boolean = true;


    constructor(){
    }

    private static async sendStatistic(stat: MediaplayFormat){
        const config = await OzoneConfig.get();
        const request = new OzoneAPIRequest();
        request.url = `${config.host}${config.endPoints.mediaplay}/send`;
        request.method = 'POST';
        request.body = JSON.stringify(stat);
        request.sendRequest()
    }

    public reportMediaUsage(media:Media){
        if(this.recordUsage && media.id){
            const report: MediaplayFormat = {
                media: media.id,
                user: visitorId,
                userAgent: navigator.userAgent,
                description: media.title,
            };
            OzoneApiMediaplay.sendStatistic(report)
        }
    }
}


export const ozoneApiMediaplay = new OzoneApiMediaplay();
