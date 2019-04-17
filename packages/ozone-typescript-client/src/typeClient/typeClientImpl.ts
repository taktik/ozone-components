import { TypeDescriptor, FieldDescriptor, UUID } from 'ozone-type'
import { TypeClient } from './typeClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import { uniqBy } from 'lodash'
import Request = httpclient.Request

export type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>

export class TypeClientImpl implements TypeClient {

	constructor(private client: OzoneClient, private baseUrl: string) {
	}

	static typeCached: TypeDescriptorCollection = new Map<string, Promise<TypeDescriptor>>()

	/**
	 * Update or create a new type
	 * @param type
	 */
	save(type: TypeDescriptor): Promise<TypeDescriptor> {
		const request = new Request(`${this.baseUrl}/rest/v3/type`)
			.setMethod('POST')
			.setBody(type)
		const typeDescriptor = this.client.call<TypeDescriptor>(request)
		TypeClientImpl.typeCached.set(type.identifier, typeDescriptor)
		return typeDescriptor
	}

	/**
	 * get a type
	 * @param identifier
	 */
	findByIdentifier(identifier: string): Promise<TypeDescriptor | null> {
		if (TypeClientImpl.typeCached.has(identifier)) {
			return TypeClientImpl.typeCached.get(identifier) as Promise<TypeDescriptor>
		} else {
			const request = new Request(`${this.baseUrl}/rest/v3/type/${identifier}`)
				.setMethod('GET')
			const typeDescriptor = this.client.call<TypeDescriptor>(request)
			TypeClientImpl.typeCached.set(identifier, typeDescriptor)
			return typeDescriptor
		}
	}

	/**
	 * get all types
	 */
	async findAll(): Promise<TypeDescriptor[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/type`)
			.setMethod('GET')
		const typeDescriptors = await this.client.call<TypeDescriptor[]>(request)
		typeDescriptors.forEach(typeDescriptor =>
			TypeClientImpl
				.typeCached
				.set(typeDescriptor.identifier, Promise.resolve(typeDescriptor)))

		return typeDescriptors
	}

	/**
	 * delete a type
	 * @param identifier
	 */
	async delete(identifier: string): Promise<UUID | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/type/${identifier}`)
			.setMethod('DELETE')
		const response = await this.client.call<UUID>(request)
		TypeClientImpl.typeCached.delete(identifier)
		return response
	}

	/**
	 * get list of fields from a type.
	 * @return {Promise<Array<FieldDescriptor>>} list of field
	 */
	async getFields(identifier: string): Promise<Array<FieldDescriptor>> {
		const typeDescriptor = await this.findByIdentifier(identifier)
		if (typeDescriptor) {
			return typeDescriptor.fields || []
		} else {
			return []
		}
	}

	/**
	 * get list of all fields (including its parents) from a type.
	 * TODO should we also get fields from trai?
	 * @param identifier
	 */
	async getAllFields(identifier: string): Promise<Array<FieldDescriptor>> {
		const type = await this.findByIdentifier(identifier)
		let parentFields: Array<FieldDescriptor> = []
		let traitFields: Array<FieldDescriptor> = []
		if (type) {
			if (type.superType) {
				parentFields = await this.getAllFields(type.superType)
			}
			if (type.traits && type.traits.length > 0) {
				for (let trait of type.traits) {
					traitFields.push(...(await this.getAllFields(trait)))
				}
			}

			const fields = type.fields || []
			return uniqBy([
				...fields,
				...parentFields,
				...traitFields
			], 'identifier')
		}
		return []
	}

	/**
	 * verify if the is an instance of an other type
	 * TODO should we also get fields from trai?
	 * @param identifier
	 * @param instance
	 */
	async isTypeInstanceOf(identifier: string, instance: string): Promise<boolean> {
		if (identifier === instance) {
			return true
		} else {
			const typeDescriptor = await(this.findByIdentifier(identifier))
			if (typeDescriptor && typeDescriptor.superType) {
				// look in parent if exist
				return (this.isTypeInstanceOf(typeDescriptor.superType, instance))
			} else {
				return false
			}
		}
	}

}
