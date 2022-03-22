import { FromOzone, Item, Query, SearchRequest, UUID, Patch, AggregationItem } from 'ozone-type'

interface ISearchResulsts<T> {
	id?: number

	total?: number

	size?: number

	results?: T[],
}

export interface SearchResults<T extends Item> extends ISearchResulsts<T> {
	aggregations?: Array<AggregationItem>
}

export type SearchIdsResults = ISearchResulsts<UUID>

export interface ItemClient<T extends Item> {
	save(item: Patch<T>): Promise<FromOzone<T>>

	saveAll(items: Patch<T>[]): Promise<FromOzone<T>[]>

	broadcast(item: T): Promise<FromOzone<T>>

	bulkBroadcast(items: T[]): Promise<FromOzone<T>[]>

	findOne(id: UUID): Promise<FromOzone<T> | null>

	findAll(): Promise<FromOzone<T>[]>

	findAllByIds(ids: UUID[]): Promise<FromOzone<T>[]>

	search(searchRequest: SearchRequest): Promise<SearchResults<FromOzone<T>>>

	searchIds(searchRequest: SearchRequest): Promise<SearchIdsResults>

	count(query?: Query): Promise<number>

	deleteById(id: UUID, permanent?: boolean): Promise<UUID | null>

	deleteByIds(ids: UUID[], permanent?: boolean): Promise<UUID[]>

	searchGenerator (searchRequest: SearchRequest): SearchIterator<T>

	queryDelete (searchQuery: Query, permanent?: boolean): Promise<UUID[]>
}
export interface SearchIterator<T> extends AsyncIterableIterator<SearchResults<FromOzone<T>>> {

	/**
	 * Cancel ongoing http request
	 * It will end the generator
	 */
	cancel(): void
}
