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

import * as models from './models'

export interface ImportSpec {
	/**
	 * If true, the imported root tenant is ignored and all its children are relinked to the tenant specified by rootTenantId option.
	 * If false, the imported root tenant is attach to the tenant specified by rootTenantId option.
	 */
	mergeRootTenant?: boolean

	/**
	 * When collision with role, user, virtual host identifier, is priority on imported entities?
	 */
	priorityOnImportedEntities?: boolean

	/**
	 * To filter items to be imported from the zip archive.
	 */
	query?: models.Query

	/**
	 * Attach imported root tenant to this tenant
	 */
	rootTenantId?: models.UUID

	/**
	 * Prefix imported tenant identifier when collision
	 */
	tenantsPrefix?: string
}
