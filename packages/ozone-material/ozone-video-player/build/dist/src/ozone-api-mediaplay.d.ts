import { Media } from 'ozone-type';
export interface MediaplayFormat {
    media: uuid;
    user: uuid;
    description?: string;
    userAgent: string;
}
export declare const ReportInterval_ms: number;
export declare class OzoneApiMediaplay {
    private recordUsage;
    constructor();
    private static sendStatistic(stat);
    reportMediaUsage(media: Media): void;
}
export declare const ozoneApiMediaplay: OzoneApiMediaplay;
