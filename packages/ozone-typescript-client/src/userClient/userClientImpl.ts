import { UUID, User, FieldsPermissionUtility, Grants } from 'ozone-type'
import { UserClient } from './userClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request
import { returnNullOn404 } from '../utility/utility'

export class UserClientImpl implements UserClient {
	constructor(private client: OzoneClient, private baseUrl: string) {}

	async save(user: Partial<User>): Promise<User> {
		const request = new Request(`${this.baseUrl}/rest/v3/user`)
			.setMethod('POST')
			.setBody(user)
		return this.client.call<User>(request)
	}

	async findOne(id: UUID): Promise<User | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/user/${id}`)
			.setMethod('GET')
		return this.client.call<User>(request).catch(returnNullOn404)
	}

	async findUsersPermissions(ids: UUID[]): Promise<FieldsPermissionUtility[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/user/permissions`)
			.setMethod('POST')
			.setBody(ids)

		const grants = await this.client.call<Grants[]>(request)
		return grants.map((grant) => {
			return new FieldsPermissionUtility(grant)
		})
	}

	async getAll(): Promise<User[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/user`)
			.setMethod('GET')
		return this.client.call<User[]>(request)
	}

	async deleteById(id: UUID, permanent?: boolean): Promise<UUID | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/user/${id}`)
			.setMethod('DELETE')
		return this.client.call<UUID>(request).catch(returnNullOn404)
	}

	async patch(user: Partial<User>): Promise<User> {
		const request = new Request(`${this.baseUrl}/rest/v3/user`)
			.setMethod('PATCH')
			.setBody(user)
		return this.client.call<User>(request)
	}
}
