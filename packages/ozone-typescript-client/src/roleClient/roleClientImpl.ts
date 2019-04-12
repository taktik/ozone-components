import {FromOzone, Role, UUID, Grants} from "ozone-type";
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request
import { RoleClient } from './roleClient'
import { OzoneClientInterface } from '../ozoneClient/ozoneClient'


export class RoleClientImpl implements RoleClient {
	constructor(private client: OzoneClientInterface, private baseUrl: string){}

	getAll(): Promise<FromOzone<Role>[]>{
		const request = new Request(`${this.baseUrl}/rest/v3/role`)
			.setMethod('GET')
		return this.client.call<FromOzone<Role>[]>(request)
	}

	save(role: Role): Promise<FromOzone<Role>>{
		const request = new Request(`${this.baseUrl}/rest/v3/role`)
			.setMethod('POST')
			.setBody(role)
		return this.client.call<FromOzone<Role>>(request)
	}

	getPermissions(...roleIds: UUID[]): Promise<Grants[]>{
		const request = new Request(`${this.baseUrl}/rest/v3/role/permissions`)
			.setMethod('POST')
			.setBody(roleIds)
		return this.client.call<Grants[]>(request)
	}

	getByName(roleName: string): Promise<FromOzone<Role>>{
		const request = new Request(`${this.baseUrl}/rest/v3/role/name/${roleName}`)
			.setMethod('GET')
		return this.client.call<FromOzone<Role>>(request)
	}

	getById(roleId: UUID): Promise<FromOzone<Role>>{
		const request = new Request(`${this.baseUrl}/rest/v3/role/${roleId}`)
			.setMethod('GET')
		return this.client.call<FromOzone<Role>>(request)
	}

	deleteById(id: UUID, permanent?: boolean): Promise<UUID | null>{
		const request = new Request(`${this.baseUrl}/rest/v3/role/${id}`)
			.setMethod('DELETE')
		return this.client.call<UUID>(request)
	}
}
