import {FromOzone, Role, UUID, Grants} from "ozone-type";

export interface RoleClient {

	getAll(): Promise<FromOzone<Role>[]>

	save(role: Role): Promise<FromOzone<Role>>

	getByName(roleName: string): Promise<FromOzone<Role>>

	getPermissions(...roleIds: UUID[]): Promise<Grants[]>

	getById(roleId: UUID): Promise<FromOzone<Role>>

	deleteById(id: UUID, permanent?: boolean): Promise<UUID | null>

}
