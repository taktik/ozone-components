import { Tenant, TenantNode, UUID } from 'ozone-type'

export interface TenantClient {

	save(tenant: Tenant): Promise<Tenant>

	findOne(id: UUID): Promise<Tenant | null>

	findByIdentifier(identifier: string): Promise<Tenant | null>

	findAll(): Promise<Tenant[]>
	findAll(ids: UUID[]): Promise<Tenant[]>

	hierarchy(rootId: UUID): Promise<TenantNode | null>

	ancestors(id: UUID, upTo?: UUID): Promise<UUID[]>

	delete(id: UUID): Promise<UUID | null>
}
