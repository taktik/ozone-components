import { TypeDescriptor, FieldDescriptor, UUID } from 'ozone-type'

export type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>

export interface TypeClient {

	/**
	 * Update or create a new type
	 * @param type
	 */
	save(type: TypeDescriptor): Promise<TypeDescriptor>

	/**
	 * get a type
	 * @param identifier
	 */
	findByIdentifier(identifier: string): Promise<TypeDescriptor | null>

	/**
	 * get all types
	 */
	findAll(): Promise<TypeDescriptor[]>

	/**
	 * delete a type
	 * @param identifier
	 */
	delete(identifier: string): Promise<UUID | null>

	/**
	 * get list of all fields (including its parents and traits) from a type.
	 * @param identifier
	 */
	getAllFields(identifier: string): Promise<FieldDescriptor[]>

	/**
	 * verify if the is an instance of an other type
	 * @param identifier
	 * @param instance
	 */
	isTypeInstanceOf(identifier: string, instance: string): Promise<boolean>

}
