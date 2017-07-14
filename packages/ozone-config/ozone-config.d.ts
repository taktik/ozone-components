declare type uuid = string;
/**
 * Structure that should verify the config.ozone.json file.
 */
interface ConfigFile {
    ozoneApi: {
        type: string;
        host: string;
        view: string;
        permissions: string;
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
            [key: string]: string;
        };
    };
}
interface ConfigType {
    type: string;
    host: string;
    view: string;
    permissions: string;
    endPoints: {
        [key: string]: string;
    };
}
declare function getOzoneConfig(): {
    configPromise: Promise<ConfigType>;
};
