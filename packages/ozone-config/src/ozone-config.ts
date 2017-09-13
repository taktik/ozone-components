/// <amd-module name="ozone-config"/>

import {OzoneRequest} from 'ozone-request'
import {jsElement} from "taktik-polymer-typeScript";
/**
 * Structure that should verify the config.ozone.json file.
 */

export interface ConfigFile {
    ozoneApi: ConfigType
}


export interface ConfigType {
    type: string,
    host: string,
    view: string,
    permissions: string,

    endPoints: {
        login: string;
        logout: string;
        items: string;
        item: string;
        session: string;
        downloadRequest: string;
        uploadStart: string;
        uploadId: string;
        upload: string;
        uploadComplete: string;
        wait: string;
        blob: string;
        fileType: string;
        [key: string]: string
    }
    format: {
        type: {
            hls: string,
            mp3: string,
            original: string,
            flowr: string,
            mp4: string,
            jpg: string,
            png: string,
            [key: string]: string
        },
        priority: {
            video: Array<string>,
            audio: Array<string>,
        }
    }
}
console.log('!!!!!!!!!!!! CONFIG !!!!!!!!!!!!!!')
const configUrl = './conf.ozone.json';
const ozoneRequest = new OzoneRequest();
ozoneRequest.url = configUrl;
ozoneRequest.method = 'GET';
const configPromise = ozoneRequest.sendRequest()
    .then((res:XMLHttpRequest) => {
        console.log('!!!!!!!!!!!! OK !!!!!!!!!!!!!!')
        return res.response.ozoneApi as ConfigType
        })
    .catch((failRequest)=>{
        console.error('Unable to find config at ', configUrl);
        throw new Error('Unable to find config')
        });


@jsElement()
export class OzoneConfig {
    static get(): Promise<ConfigType> {
        return configPromise;
    };
}