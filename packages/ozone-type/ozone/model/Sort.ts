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

export interface Sort {
    field: string;

    order?: Sort.OrderEnum;

    missing?: Sort.MissingEnum;

}
export namespace Sort {
    export enum OrderEnum {
        ASC = <any> 'ASC',
        DESC = <any> 'DESC',
        NONE = <any> 'NONE'
    }
    export enum MissingEnum {
        FIRST = <any> 'FIRST',
        LAST = <any> 'LAST'
    }
}
