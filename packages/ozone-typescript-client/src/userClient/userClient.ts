import { User, UUID, FieldsPermissionUtility } from 'ozone-type'

export interface UserClient {
	save(user: Partial<User>): Promise<User>

	findOne(id: UUID): Promise<User | null>

	findUsersPermissions(ids: UUID[]): Promise<FieldsPermissionUtility[]>

	getAll(): Promise<User[]>

	deleteById(id: UUID, permanent?: boolean): Promise<UUID | null>

	patch(user: Partial<User>): Promise<User>
}
