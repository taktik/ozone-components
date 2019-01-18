import {OzoneAPIRequest} from 'ozone-api-request'

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
    uploadChannel: string,
}

const configUrl = './conf.ozone.json';
const ozoneAPIRequest = new OzoneAPIRequest();
ozoneAPIRequest.url = configUrl;
ozoneAPIRequest.method = 'GET';

export class OzoneConfig {
    private static configPromise: Promise<ConfigType> | null = null;
    static get(): Promise<ConfigType> {
        if(!OzoneConfig.configPromise){
            OzoneConfig.configPromise = ozoneAPIRequest.sendRequest()
                .then((res:XMLHttpRequest) => {
                    return res.response.ozoneApi as ConfigType
                })
                .catch((failRequest: XMLHttpRequest)=>{
                    console.error('Unable to find config at ', configUrl);
                    throw new Error('Unable to find config')
                });
        }
        return OzoneConfig.configPromise;

    };
}
