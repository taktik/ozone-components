/**
 * Created by hubert on 8/06/17.
 */

import { getDefaultClient } from 'ozone-default-client'
import { OzoneClient } from 'ozone-typescript-client'
import { Item, ItemSearchResult, UUID, FromOzone } from 'ozone-type'
import { SearchQuery } from 'ozone-search-helper'
import { v4 as uuid } from 'uuid'
import SearchIterator = OzoneClient.SearchIterator
import SearchResults = OzoneClient.SearchResults
/**
 * Function decorator decorator to be used to wait until
 * all other decorated function resolve.
 * This decorator is aimed to be used in class that implement StatefulOzone.
 * It's purpose is to wait others ozone call finish, before sending a next one.
 *
 */
export function lockRequest() {
	return function(target: StatefulOzone, propertyKey: string, descriptor: PropertyDescriptor) {
		let originalMethod = descriptor.value

		descriptor.value = function() {
			const self: StatefulOzone = this as any
			const arg = arguments

			self._currentRequest = self._currentRequest
			.catch()
			.then(() => {
				return originalMethod.apply(this, arg)
			})
			return self._currentRequest
		}
	}
}

export interface StatefulOzone {
	_currentRequest: Promise<any>
}
/**
 * `ozone-api-item` is low level es6 module to ozone api.
 * It provide CRUD operation and search in a given collection.
 *
 * * Example
 * ```javaScript
 * const ozoneApiSearch = new OzoneApiItem(); // return instance of OzoneApiItem located in the dom
 * const result = ozoneApiSearch.on('item').getOne('an-id');
 * ```
 *
 */

export class OzoneApiItem<T = Item> {

	/**
	 * type of the ozone collection.
	 * Default value is 'item'
	 */
	private collection: string = 'item'

	/**
	 * set collection and return this to be chain by a query.
	 * @param {string} collection
	 * @return {OzoneApiItem} this
	 */
	on(collection: string) {
		this.setCollection(collection)
		return this
	}

	/**
	 * Set ozone collection to query
	 * @param {string} collection
	 */
	setCollection(collection: string) {
		this.collection = collection
	}

	/**
	 * Create or update a collection item.
	 * @param data Item item to create.
	 * @return {Promise<Item>}
	 */
	create(data: Partial<T>): Promise<FromOzone<T> | null> {
		return this.update(data)
	}

	/**
	 * Create or update a collection item.
	 * @param data Item item to update.
	 * @return {Promise<Item>}
	 */
	async update(data: Partial<T>): Promise<FromOzone<T> | null> {
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return itemClient.save(data)
	}

	/**
	 * get one collection item by uuid.
	 * @param id
	 * @return {Promise<Item | null>}
	 */
	async getOne(id: UUID): Promise<FromOzone<T> | null> {
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return itemClient.findOne(id)
	}

	/**
	 * delete one collection item by uuid.
	 * @param id
	 * @return {Promise<any>}
	 */
	async deleteOne(id: UUID): Promise<UUID | null> {
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return itemClient.deleteById(id)
	}

	/**
	 * get collection items from a list of id.
	 * @param ids {Array<UUID>} array of id to get
	 * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
	 */
	async bulkGet(ids: Array<UUID>): Promise<Array<FromOzone<T>> | null> {
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return itemClient.findAllByIds(ids)
	}

	/**
	 * delete items from a list of id.
	 * @param ids
	 * @return {Promise<Array<UUID>>} promise resole with an array of deleted id
	 */
	async bulkDelete(ids: Array<UUID | undefined>): Promise<Array<UUID> | null> {
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return itemClient.deleteByIds(ids.filter(id => !!id) as UUID[])
	}

	/**
	 * save an array of items
	 * @param items
	 * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
	 */
	async bulkSave(items: Array<Partial<T>>): Promise<Array<FromOzone<T>> | null> {
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return itemClient.saveAll(items)
	}

	/**
	 * Submit ozone search query
	 */
	async search (search: SearchQuery): Promise<SearchGenerator<T>> {
		if (search.collection) {
			this.on(search.collection)
		}
		const itemClient = getDefaultClient().itemClient<T>(this.collection)
		return new SearchGenerator(itemClient.searchGenerator(search))
	}
}

/**
 * Class helper to iterate on search result.
 * * Example:
 * ```javaScript
 *   let searchQuery = new SearchQuery();
 *   searchQuery.quicksearch('');
 *   const searchGenerator = ozoneItemApi.search(searchQuery);
 *   searchGenerator.next().then((searchResult)=>{
 *               searchResult.results.forEach((item)=>{
 *                   this.push('items', item);
 *               })
 *           });
 * ```
 */
export class SearchGenerator<T extends Item = Item> implements StatefulOzone {
	_currentRequest: Promise<any> = Promise.resolve()

	constructor(private searchIterator: SearchIterator<T>) { }

	/**
	 * load next array of results
	 * @return {Promise<SearchResult>}
	 */
	@lockRequest()
	async next(): Promise<SearchResults<FromOzone<T>>> {
		const { value } = await this.searchIterator.next()
		return value
	}
	cancelRequest(): void {
		this.searchIterator.cancel()
	}
}
