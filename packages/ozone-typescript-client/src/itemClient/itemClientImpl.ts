import { FromOzone, Item, Query, SearchRequest, UUID, State as MetaState, Patch, DeviceMessage } from 'ozone-type'
import { ItemClient, SearchResults } from './itemClient'
import { OzoneClientInterface } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response
import Request = httpclient.Request

export class ItemClientImpl<T extends Item> implements ItemClient<T> {
	constructor(private client: OzoneClientInterface, private baseUrl: string, private typeIdentifier: string){}

	async count(query?: Query): Promise<number> {
		const results = await this.search({
			query: query,
			size: 0
		})
		return results.total || 0
	}

	deleteById(id: UUID, permanent?: boolean): Promise<UUID | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/${id}`)
			.setMethod('DELETE')
		return this.client.call<UUID>(request)
	}

	deleteByIds(ids: UUID[], permanent?: boolean): Promise<UUID[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/bulkDelete`)
			.setMethod('POST')
			.setBody()
		return this.client.call<UUID[]>(request)
	}

	async findAll(): Promise<FromOzone<T>[]> {
		const results = await this.search({
			size: 10_000
		})
		return results.results || []
	}

	findAllByIds(ids: UUID[]): Promise<FromOzone<T>[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/bulkGet`)
			.setMethod('POST')
			.setBody(ids)
		return this.client.call<FromOzone<T>[]>(request)
	}

	findOne(id: UUID): Promise<FromOzone<T> | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/${id}`)
			.setMethod('GET')
		return this.client.call<FromOzone<T>>(request)
	}

	async save(item: Patch<T>): Promise<FromOzone<T>> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}`)
			.setMethod('POST')
			.setBody(item)
		const savedItem = await this.client.call<FromOzone<T>>(request)
		if (savedItem._meta.state === MetaState.ERROR) {
			throw savedItem
		}
		return savedItem
	}

	async saveAll(items: Patch<T>[]): Promise<FromOzone<T>[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/bulkSave`)
			.setMethod('POST')
			.setBody(items)
		const savedItems = await this.client.call<FromOzone<T>[]>(request)
		if (savedItems.some(item => item._meta.state === MetaState.ERROR)) {
			throw savedItems
		}
		return savedItems
	}

	search(searchRequest: SearchRequest): Promise<SearchResults<FromOzone<T>>> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/search`)
			.setMethod('POST')
			.setBody(searchRequest)
		return this.client.call<SearchResults<FromOzone<T>>>(request)
	}

	async broadcast(item: T): Promise<FromOzone<T>> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/broadcast`)
			.setMethod('POST')
			.setBody(item)
		const savedItem = await this.client.call<FromOzone<T>>(request)
		if (savedItem._meta.state === MetaState.ERROR) {
			throw savedItem
		}
		return savedItem
	}

	async bulkBroadcast(items: T[]): Promise<FromOzone<T>[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/bulkBroadcast`)
			.setMethod('POST')
			.setBody(items)
		const savedItems = await this.client.call<FromOzone<T>[]>(request)
		if (savedItems.some(item => item._meta.state === MetaState.ERROR)) {
			throw savedItems
		}
		return savedItems
	}
	
}