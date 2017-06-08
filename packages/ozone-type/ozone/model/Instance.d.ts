export interface Instance {
    id?: string;
    defaultTenantId?: string;
    name?: string;
    keyspaceName?: string;
    keyspaceReplication?: {
        [key: string]: string;
    };
    keyspaceDurableWrites?: boolean;
    indexName?: string;
    defaultStorageUnitId?: string;
    storageUnitIds?: Array<string>;
}
