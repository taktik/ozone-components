import { httpclient } from 'typescript-http-client'
import { TypeDescriptor, FieldDescriptor, UUID } from 'ozone-type'
import { TypeClient } from './typeClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import Request = httpclient.Request
import { TypeCacheImpl } from './typeCacheImpl'
export type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>

export class TypeClientImpl implements TypeClient {

	constructor(private client: OzoneClient, private baseUrl: string) {
	}

	save(type: TypeDescriptor): Promise<TypeDescriptor> {
		const request = new Request(`${this.baseUrl}/rest/v3/type`)
			.setMethod('POST')
			.setBody(type)
		return this.client.call<TypeDescriptor>(request)
	}

	findByIdentifier(identifier: string): Promise<TypeDescriptor | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/type/${identifier}`)
				.setMethod('GET')
		return this.client.call<TypeDescriptor>(request)
	}

	async findAll(): Promise<TypeDescriptor[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/type`)
			.setMethod('GET')
		return this.client.call<TypeDescriptor[]>(request)

	}

	async delete(identifier: string): Promise<UUID | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/type/${identifier}`)
			.setMethod('DELETE')
		return this.client.call<UUID>(request)
	}

	async getFields(identifier: string): Promise<Array<FieldDescriptor>> {
		const typeDescriptor = await this.findByIdentifier(identifier)
		if (typeDescriptor) {
			return typeDescriptor.fields || []
		} else {
			return []
		}
	}

	private typeCache?: TypeCacheImpl

	async getTypeCache(): Promise<TypeCacheImpl> {
		if (this.typeCache) {
			return this.typeCache
		} else {
			const typeDescriptors = await this.findAll()
			return new TypeCacheImpl(typeDescriptors)
		}
	}
}
