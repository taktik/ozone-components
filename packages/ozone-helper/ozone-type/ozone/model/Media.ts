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

export interface Media extends models.Item {
    localizedShortDescription?: { [key: string]: string; };

    localizedName?: { [key: string]: string; };

    usage?: string;

    mediaUuid?: string;

    localizedDescription?: { [key: string]: string; };

    localizedTitle?: { [key: string]: string; };

    restricted?: boolean;

    date?: models.Date;

    country?: string;

    keywords?: Array<string>;

    city?: string;

    fileUTI?: Array<string>;

    fullText?: string;

    caption?: string;

    source?: string;

    representedBy?: string;

    title?: string;

    stocks?: Array<string>;

    parentFolder?: string;

    file?: string;

    previewDate?: models.Date;

    collections?: Array<string>;

    credit?: string;

    height?: number;

    byLine?: string;

    previewRatio?: number;

    length?: number;

    creationDate?: models.Date;

    derivedFiles?: Array<string>;

    modificationDate?: models.Date;

    specialInstructions?: string;

    width?: number;

    objectName?: string;

    category?: string;

    publications?: Array<string>;

    status?: string;

}
