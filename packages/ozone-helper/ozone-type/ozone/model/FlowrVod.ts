/**
 * Ozone
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 3.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface FlowrVod {
    realisators?: string;

    groupingId?: string;

    year?: number;

    presentators?: string;

    language?: string;

    seasonNumber?: number;

    episodeNumber?: number;

    actors?: string;

    highlight?: boolean;

    subTitle?: { [key: string]: string; };

    parentalGuidance?: number;

    vodType?: string;

    genre?: string;

    editors?: string;

}