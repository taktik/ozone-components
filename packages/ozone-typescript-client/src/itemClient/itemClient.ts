import { FromOzone, Item, Query, SearchRequest, UUID, Patch, AggregationItem } from 'ozone-type'
import { SearchQuery } from 'ozone-search-helper'

export interface SearchResults<T extends Item> {
	id?: number

	total?: number

	size?: number

	results?: T[],

	aggregations?: Array<AggregationItem>
}

export interface ItemClient<T extends Item> {
	save(item: Patch<T>): Promise<FromOzone<T>>

	saveAll(items: Patch<T>[]): Promise<FromOzone<T>[]>

	broadcast(item: T): Promise<FromOzone<T>>

	bulkBroadcast(items: T[]): Promise<FromOzone<T>[]>

	findOne(id: UUID): Promise<FromOzone<T> | null>

	findAll(): Promise<FromOzone<T>[]>

	findAllByIds(ids: UUID[]): Promise<FromOzone<T>[]>

	search(searchRequest: SearchRequest): Promise<SearchResults<FromOzone<T>>>

	count(query?: Query): Promise<number>

	deleteById(id: UUID, permanent?: boolean): Promise<UUID | null>

	deleteByIds(ids: UUID[], permanent?: boolean): Promise<UUID[]>

	searchGenerator (searchQuery: SearchQuery): SearchIterator<T>

	queryDelete (searchRequest: SearchRequest): Promise<UUID[]>
}
export interface SearchIterator<T> extends AsyncIterableIterator<SearchResults<FromOzone<T>>> {

	/**
	 * Cancel ongoing http request
	 * It will end the generator
	 */
	cancel(): void
}
