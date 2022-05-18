import { TypeDescriptor, FieldDescriptor, Item } from 'ozone-type'
import uniqBy from '../utility/uniqBy'
import { TypeCache } from './typeCache'
import { Cache } from '../cache/cache'
import { TypeClient } from './typeClient'
export type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>

export class TypeCacheImpl implements TypeCache {

	private _cache = new Cache<string, TypeDescriptor>()

	constructor(private _typeClient: TypeClient, typeDescriptors: TypeDescriptor[]) {
		this.updateCache(typeDescriptors)
	}

	getAllFields(identifier: string): FieldDescriptor[] {
		const type = this.get(identifier)
		if (!type) {
			throw new Error('Type not found in cache : ' + identifier)
		}
		let parentFields: FieldDescriptor[] = []
		let traitFields: FieldDescriptor[] = []
		if (type.superType) {
			parentFields = this.getAllFields(type.superType)
		}
		if (type.traits && type.traits.length > 0) {
			type.traits.forEach(trait => traitFields.push(...this.getAllFields(trait)))
		}

		const fields = type.fields || []
		return uniqBy([
			...fields,
			...parentFields,
			...traitFields
		], 'identifier')
	}

	isTypeInstanceOf(identifier: string, instance: string): boolean {
		if (identifier === instance) {
			return true
		} else {
			const typeDescriptor = this.get(identifier)
			if (!typeDescriptor) {
				throw new Error('Type not found in cache : ' + identifier)
			}
			const parentsToCheck = []
			if (typeDescriptor.superType) {
				// look in parent if exist
				parentsToCheck.push(typeDescriptor.superType)
			}
			parentsToCheck.push(...(typeDescriptor.traits || []))
			return parentsToCheck.some(identifier => this.isTypeInstanceOf(identifier, instance))
		}
	}

	isType<T>(data: Item, instance: string): data is T {
		return !!data.type && this.isTypeInstanceOf(data.type, instance)
	}

	asInstanceOf<T>(data: Item, instance: string): T | null {
		if (data.type && this.isTypeInstanceOf(data.type, instance)) {
			return data as T
		} else {
			return null
		}
	}

	get(identifier: string): TypeDescriptor | undefined {
		return this._cache.get(identifier)
	}

	has(identifier: string): boolean {
		return this._cache.has(identifier)
	}

	getAllCachedTypeIdentifiers(): string[] {
		return Array.from(this._cache.keys())
	}

	async refresh(): Promise<TypeCache> {
		const typeDescriptors = await this._typeClient.findAll()
		this.updateCache(typeDescriptors)
		return this
	}

	private updateCache(typeDescriptors: TypeDescriptor[]) {
		this._cache.clear()
		typeDescriptors.forEach(typeDescriptor =>
			this._cache.set(typeDescriptor.identifier, typeDescriptor))
	}
}
