export interface Connector {
    id?: string;
    identifier?: string;
    type: Connector.TypeEnum;
    defaultVirtualHostId: string;
    defaultVirtualHostInstanceId?: string;
    configuration?: string;
}
export declare namespace Connector {
    enum TypeEnum {
        HTTP,
        FTP,
        RTSP,
    }
}
