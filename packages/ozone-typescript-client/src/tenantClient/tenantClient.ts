import { Tenant, TenantNode, UUID } from 'ozone-type'

export interface TenantClient {

	/**
	 * Update or create a tenant
	 * @param tenant
	 */
	save(tenant: Tenant): Promise<Tenant>

	/**
	 * get a tenant
	 * @param id
	 */
	findOne(id: UUID): Promise<Tenant | null>

	/**
	 * get a tenant
	 * @param identifier
	 */
	findByIdentifier(identifier: string): Promise<Tenant | null>

	/**
	 * get all tenants, or only the tenants with the given ids
	 * @param ids
	 */
	findAll(ids?: UUID[]): Promise<Tenant[]>

	/**
	 * get the tenant hierarchy (tree of tenant nodes) rooted at the given tenant
	 * @param rootId
	 */
	hierarchy(rootId: UUID): Promise<TenantNode | null>

	/**
	 * get the ids of the ancestors of a tenant, ordered from the nearest parent up to the root.
	 * When upTo is given, the chain stops at that ancestor (inclusive).
	 * @param id
	 * @param upTo
	 */
	ancestors(id: UUID, upTo?: UUID): Promise<UUID[]>

	/**
	 * delete a tenant
	 * @param id
	 */
	delete(id: UUID): Promise<UUID | null>
}
