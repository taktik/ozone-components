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
export interface FieldDescriptor {
    identifier: string;
    name?: models.LocalizedString;
    description?: models.LocalizedString;
    fieldType: string;
    fieldComputer?: string;
    group?: string;
    indexed?: boolean;
    stored?: boolean;
    readOnly?: boolean;
    serverSide?: boolean;
    inQuickSearch?: boolean;
    overridable?: boolean;
    deprecated?: boolean;
    deprecationReason?: string;
    constraints?: Array<models.Constraint>;
    defaultValue?: any;
}
