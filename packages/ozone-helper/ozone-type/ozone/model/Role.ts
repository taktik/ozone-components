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

export interface Role {
    id?: string;

    tenantId?: string;

    name: string;

    virtualHostDependency?: Role.VirtualHostDependencyEnum;

    grants?: Array<models.Permission>;

    revokes?: Array<models.Permission>;

    scopes?: Array<models.Permission>;

    parents?: Array<string>;

    virtualHosts?: Array<string>;

}
export namespace Role {
    export enum VirtualHostDependencyEnum {
        NONE = <any> 'NONE',
        DIRECT = <any> 'DIRECT',
        FULL = <any> 'FULL'
    }
}
