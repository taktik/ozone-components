import { httpclient } from 'typescript-http-client'
import { uniqBy } from 'lodash'
import { TypeDescriptor, FieldDescriptor, UUID } from 'ozone-type'
import { TypeCache } from './typeCache'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import Request = httpclient.Request
import { Cache } from '../cache/cache'
export type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>

export class TypeCacheImpl implements TypeCache {

	private _cache = new Cache<string, TypeDescriptor>()

	constructor(typeDescriptors: TypeDescriptor[]) {
		typeDescriptors.forEach(typeDescriptor =>
		this._cache.set(typeDescriptor.identifier, typeDescriptor))
	}

	getAllFields(identifier: string): Array<FieldDescriptor> {
		const type = this.get(identifier)
		let parentFields: Array<FieldDescriptor> = []
		let traitFields: Array<FieldDescriptor> = []
		if (type) {
			if (type.superType) {
				parentFields = this.getAllFields(type.superType)
			}
			if (type.traits && type.traits.length > 0) {
				for (let trait of type.traits) {
					traitFields.push(...this.getAllFields(trait))
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

	isTypeInstanceOf(identifier: string, instance: string): boolean {
		if (identifier === instance) {
			return true
		} else {
			const typeDescriptor = this.get(identifier)
			if (typeDescriptor && typeDescriptor.superType) {
				// look in parent if exist
				return (this.isTypeInstanceOf(typeDescriptor.superType, instance))
			} else {
				return false
			}
		}
	}

	get(identifier: string): TypeDescriptor | undefined {
		return this._cache.get(identifier)
	}

	has(identifier: string): boolean {
		return this._cache.has(identifier)
	}
}
