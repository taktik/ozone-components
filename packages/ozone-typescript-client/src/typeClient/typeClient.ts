import { FromOzone, TypeDescriptor, FieldDescriptor, Grants, UUID } from 'ozone-type'

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
	findByIdentifier(identifier: string): Promise<TypeDescriptor>

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
	 * get list of fields from a type.
	 * @return {Promise<Array<FieldDescriptor>>} list of field
	 */
	getFields(identifier: string): Promise<Array<FieldDescriptor>>

	/**
	 * get list of all fields (including its parents) from a type.
	 * TODO should we also get fields from trai?
	 * @param identifier
	 */
	getAllFields(identifier: string): Promise<Array<FieldDescriptor>>

	/**
	 * verify if the is an instance of an other type
	 * @param identifier
	 * @param instance
	 */
	isTypeInstanceOf(identifier: string, instance: string): Promise<boolean>

}
