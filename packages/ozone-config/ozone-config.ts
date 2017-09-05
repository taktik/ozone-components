
/**
 * Structure that should verify the config.ozone.json file.
 */
declare interface ConfigFile{
    ozoneApi: {
        type: string,
        host:string,
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
            [key: string]: string
        }
    }
}


declare interface ConfigType {
    type: string,
    host:string,
    view: string,
    permissions: string,

    endPoints: {
        [key: string]: string
    }
    format:{
        "hls": string,
        "mp4": string,
        "jpg": string,
        "png": string,
    }
}

declare function getOzoneConfig(): {configPromise: Promise<ConfigType>};