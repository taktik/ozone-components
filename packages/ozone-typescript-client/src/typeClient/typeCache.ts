import { TypeDescriptor, FieldDescriptor } from 'ozone-type'

export type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>

export interface TypeCache {

	/**
	 * get list of all fields (including its parents and traits) from a type.
	 * @param identifier
	 */
	getAllFields(identifier: string): FieldDescriptor[]

	/**
	 * verify if the is an instance of an other type
	 * @param identifier
	 * @param instance
	 */
	isTypeInstanceOf(identifier: string, instance: string): boolean

	/**
	 *
	 * @param identifier
	 */
	get(identifier: string): TypeDescriptor | undefined

	/**
	 *
	 * @param identifier
	 */
	has(identifier: string): boolean
}
