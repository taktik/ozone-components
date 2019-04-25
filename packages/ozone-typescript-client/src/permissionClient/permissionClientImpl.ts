import { Grants, UUID,
	FieldsPermissionUtility } from 'ozone-type'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { PermissionClient } from './permissionClient'

export class PermissionClientImpl implements PermissionClient {

	constructor(private client: OzoneClient, private baseUrl: string) {}

	async bulkGetPermissions(fieldsIdentifiers: string[], itemIds: UUID[]): Promise<Map<string, FieldsPermissionUtility>> {
		const fieldsId = fieldsIdentifiers
		const parameters = new URLSearchParams()
		parameters.append('fields', fieldsId.join(','))

		const request = new Request(`${this.baseUrl}/rest/v3/items/bulkGetPermissions?${parameters.toString()}`)
			.setMethod('POST')
			.setBody(itemIds)

		const grants = await this.client.call<Grants[]>(request)

		const result = new Map<string, FieldsPermissionUtility>()
		grants.forEach((grant) => {
			result.set(grant.id!, new FieldsPermissionImpl(grant))
		})
		return result
	}

	async getPermissions(fieldsIdentifiers: string[], itemId: UUID): Promise<FieldsPermissionUtility | undefined> {
		const permissions = await this.bulkGetPermissions(fieldsIdentifiers, [itemId])
		return permissions.get(itemId)
	}
}

export class FieldsPermissionImpl implements FieldsPermissionUtility {

	constructor(public grant: Grants) {}

	hasFieldPermission(fieldName: string, permission: Grants.FieldGrantsEnum): boolean {
		if (this.grant.fieldGrants && this.grant.fieldGrants.hasOwnProperty(fieldName)) {
			return typeof (
				this.grant.fieldGrants[fieldName]
					.find(i => i === permission as any)
			) === 'string'
		} else {
			return false
		}
	}

	isFieldEditable(fieldName: string): boolean {
		return this.hasFieldPermission(fieldName, Grants.FieldGrantsEnum.FIELDEDIT)
	}

}
