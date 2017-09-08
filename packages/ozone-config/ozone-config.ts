
/**
 * Structure that should verify the config.ozone.json file.
 */
declare interface ConfigFile{
    ozoneApi: ConfigType
}


declare interface ConfigType {
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
        blob: string;
        fileType: string;
        [key: string]: string
    }
    format:{
        type: {
            hls: string,
            mp3: string,
            original: string,
            flowr:string,
            mp4: string,
            jpg: string,
            png: string,
            [key: string]: string
        },
        priority:{
            video: Array<string>,
            audio: Array<string>,
        }
    }
}

declare function getOzoneConfig(): {configPromise: Promise<ConfigType>};