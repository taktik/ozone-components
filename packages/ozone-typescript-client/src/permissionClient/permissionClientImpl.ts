import {FieldDescriptor, FromOzone, Grants, Role, UUID} from "ozone-type";
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { PermissionClient, FieldsPermission } from './permissionClient'



export class PermissionClientImpl implements PermissionClient {

	constructor(private client: OzoneClient, private baseUrl: string){}

	/**
	 * request given fields permission for one item
	 * @param fields
	 * @param itemIds
	 */
	async bulkGetPermissions(fields:Array<FieldDescriptor>, itemIds:UUID[]): Promise<Map<string, FieldsPermission>>
	{
		const fildsId = fields.map(field => field.identifier);
		const parameters = new URLSearchParams()
		parameters.append('fields', fildsId.join(','))

		const request = new Request(`${this.baseUrl}/rest/v3/items/bulkGetPermissions?${parameters.toString()}`)
			.setMethod('POST')
			.setBody(fildsId)

		const grants = await  this.client.call<Array<FromOzone<Grants>>>(request)

		const result: Map<string, FieldsPermission> = new Map()
		grants.forEach((grant) => {
			result.set(grant.id, new FieldsPermissionImpl(grant))
		});
		return result;
	}

	async getPermissions(fields:Array<FieldDescriptor>, itemId:UUID): Promise<FieldsPermission>{
		const permissions = await this.bulkGetPermissions(fields, [itemId])
		return permissions.get(itemId)!
	}
}

export class FieldsPermissionImpl implements FieldsPermission {

	constructor(public grant:Grants) {}

	isFieldEditable(fieldName:string):boolean {
		if(this.grant.fieldGrants && this.grant.fieldGrants.hasOwnProperty(fieldName)) {
			return typeof (
				this.grant.fieldGrants[fieldName]
					.find(i => i == 'FIELD_EDIT')
			) == 'string';
		}  else {
			return false
		}
	}


}
