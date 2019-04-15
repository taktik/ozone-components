import { FieldDescriptor, Grants, UUID } from 'ozone-type'

export interface PermissionClient {
	/**
	 * request given fields permission for one item
	 * @param fields
	 * @param itemIds
	 */
	bulkGetPermissions(fields: Array<FieldDescriptor>, itemIds: UUID[]): Promise<Map<string, FieldsPermission>>

	getPermissions(fields: Array<FieldDescriptor>, itemIds: UUID): Promise<FieldsPermission>
}

export interface FieldsPermission {
	grant: Grants

	isFieldEditable(fieldName: string): boolean
}
