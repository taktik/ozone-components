import { FromOzone, Item, Query, SearchRequest, UUID, State as MetaState, Patch } from 'ozone-type'
import { ItemClient, SearchResults, SearchIterator, GraphQLSearchIterator, SearchIdsResults } from './itemClient'
import { OzoneClient } from '../ozoneClient/ozoneClient'
import { httpclient } from 'typescript-http-client'
import Request = httpclient.Request
import { returnNullOn404, deepCopy } from '../utility/utility'
import { ApolloClient, gql, HttpLink, InMemoryCache, NormalizedCacheObject, OperationVariables, TypedDocumentNode } from '@apollo/client/core'

export class ItemClientImpl<T extends Item> implements ItemClient<T> {
	constructor(private client: OzoneClient, private baseUrl: string, private typeIdentifier: string) {}

	async count(query?: Query): Promise<number> {
		const results = await this.search({
			query: query,
			size: 0
		})
		return results.total || 0
	}

	deleteById(id: UUID, permanent = false): Promise<UUID | null> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/${id}${permanent ? '?permanent=true' : ''}`)
			.setMethod('DELETE')
		return this.client.call<UUID>(request).catch(returnNullOn404)
	}

	deleteByIds(ids: UUID[], permanent = false): Promise<UUID[]> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/bulkDelete${permanent ? '?permanent=true' : ''}`)
			.setMethod('POST')
			.setBody(ids)
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
		return this.client.call<FromOzone<T>>(request).catch(returnNullOn404)
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

	graphqlSearch<TData = any, TVariables = OperationVariables>(query: TypedDocumentNode<TData, TVariables>, variables ?: TVariables): Promise<TData> {
		return this.getGraphqlClient().query({
			query: query, variables: variables
		}).then(result => result.data)
	}

	searchIds(searchRequest: SearchRequest): Promise<SearchIdsResults> {
		const request = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/searchIds`)
			.setMethod('POST')
			.setBody(searchRequest)
		return this.client.call<SearchIdsResults>(request)
	}

	searchGenerator (searchRequest: SearchRequest): SearchIterator<T> {
		return new SearchIteratorImpl<T>(this.client, this.baseUrl, this.typeIdentifier, searchRequest)
	}

	graphQLSearchGenerator<TData = any, TVariables = OperationVariables>(query: TypedDocumentNode<TData, TVariables>, variables ?: TVariables): GraphQLSearchIterator<TData> {
		return new GraphQLSearchIteratorImpl<TData, TVariables>(this.client, this.baseUrl, query, variables)
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

	async queryDelete (searchQuery: Query, permanent = false): Promise<UUID[]> {
		const url = `${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/queryDelete${permanent ? '?permanent=true' : ''}`
		const request = new Request(url)
			.setMethod('POST')
			.setBody(searchQuery)
		return this.client.call<UUID[]>(request)
	}

	private getGraphqlClient(): ApolloClient<NormalizedCacheObject> {
		const link = new HttpLink({
			fetch: (uri, options) => {
				const req = new Request(`${this.baseUrl}/rest/v3/graphql`, { method: options?.method, body: options?.body })
				return this.client.call<string>(req).then(it => {
					let obj = {}
					// @ts-ignore
					obj.text = () => new Promise(function(resolve, reject) { resolve(JSON.stringify(it)) })
					return obj as Response
				})
			}
		})

		return new ApolloClient({
			uri: `${this.baseUrl}/rest/v3/graphql`,
			cache: new InMemoryCache(),
			link
		})
	}
}

class SearchIteratorImpl<T> implements SearchIterator<T> {
	private hasMoreData: boolean = true
	private loadingSize: number = 0

	currentRequest?: Request

	constructor(private client: OzoneClient, private baseUrl: string, private typeIdentifier: string, private searchRequest: SearchRequest) {}

	private _search(searchRequest: SearchRequest): Promise<SearchResults<FromOzone<T>>> {
		try {
			this.currentRequest = new Request(`${this.baseUrl}/rest/v3/items/${this.typeIdentifier}/search`)
				.setMethod('POST')
				.setBody(searchRequest)
			return this.client.call<SearchResults<FromOzone<T>>>(this.currentRequest)
		} catch (err) {
			if (err.request?.isAborted) {
				throw Error('search aborted')
			} else {
				throw err
			}
		}
	}

	public async next(forceOffset?: number): Promise<IteratorResult<SearchResults<FromOzone<T>>>> {
		try {
			if (this.hasMoreData || forceOffset !== undefined) {
				this.searchRequest.offset = forceOffset !== undefined ? forceOffset : this.loadingSize
				const response = await this._search(this.searchRequest)
				this.loadingSize = this.searchRequest.offset + (response.size || 0)
				const done = !this.hasMoreData
				this.hasMoreData = this.loadingSize < Number(response.total || 0)
				return { value: response, done }
			}
		} catch (err) {
			if (! (err.request?.isAborted)) {
				throw err
			}
		}
		return { done: true, value: {} }
	}
	public cancel() {
		if (this.currentRequest) {
			this.currentRequest.abort()
		}
	}
	[Symbol.asyncIterator]() {
		return this
	}
}

class GraphQLSearchIteratorImpl<TData = any, TVariables = OperationVariables> implements GraphQLSearchIterator<TData> {
	private hasMoreData: boolean = true
	private loadingSize: number = 0

	currentRequest?: Request

	constructor(private client: OzoneClient, private baseUrl: string, private query: TypedDocumentNode<TData, TVariables>, private variables ?: TVariables) {}

	//    query<T = any, TVariables = OperationVariables>(options: QueryOptions<TVariables, T>): Promise<ApolloQueryResult<T>>;
	private _search(query: TypedDocumentNode<TData, TVariables>, variables ?: TVariables): Promise<TData> {
		try {
			const gqlQuery = gql(`
                query {
                    flowrPackages {
                        items {
							id
							name
						}
                    }
                }
			`)
			this.getGraphqlClient().query({
				query: gqlQuery
			}).then(result => console.log(result)).catch(it => `obligatory catch: ${it}`)

			// this.getGraphqlClient().query({
			// 	query: PackageMediasDocument, variables: { "package": "Valtteri Bottas" }
			// }).then(result => console.log(result));

			this.getGraphqlClient().query({
				query: query, variables: variables
			}).then(result => {
				console.log(result)
			}).catch(it => `obligatory catch: ${it}`)

			return this.getGraphqlClient().query({
				query: query, variables: variables
			}).then(result => result.data)
			// if (loading); if (error)...
			// this.currentRequest = new Request(`${this.baseUrl}/rest/v3/graphql`)
			// 	.setMethod('POST')
			// 	.setBody(new GraphQLBody(this.typeIdentifier, searchRequest, selectionSet)) // e.g. selectionSet = 'items { name }'
			// return this.client.call<FromGraphQL<T>>(this.currentRequest)
		} catch (err) {
			if (err.request?.isAborted) {
				throw Error('search aborted')
			} else {
				throw err
			}
		}
	}

	public async next(forceOffset?: number): Promise<IteratorResult<TData>> {
		try {
			if (this.hasMoreData || forceOffset !== undefined) {
				console.log('TODO')
				// this.searchRequest.offset = forceOffset !== undefined ? forceOffset : this.loadingSize
				const response = await this._search(this.query, this.variables)
				// const data = response.data[`${this.typeIdentifier}s`]
				// const totalCount: number = data.totalCount
				// const items: any[] = data.items
				// const size: number = items.length
				// this.loadingSize = this.searchRequest.offset + (size || 0)
				// const done = !this.hasMoreData
				// this.hasMoreData = this.loadingSize < Number(totalCount || 0)
				return { value: response, done: true } // done
				// throw new Error('Not implemented yet')
			}
		} catch (err) {
			if (err.request?.isAborted) {
				throw Error('search aborted')
			} else {
				throw err
			}
		}
		return { done: true, value: {} }
	}
	public cancel() {
		if (this.currentRequest) {
			this.currentRequest.abort()
		}
	}
	[Symbol.asyncIterator]() {
		return this
	}

	private getGraphqlClient(): ApolloClient<NormalizedCacheObject> {
		const link = new HttpLink({
			fetch: (uri, options) => {
				const uriString: string = typeof uri === 'string' ? uri : uri.url
				const body: BodyInit | undefined | null = options?.body
				const method: string | undefined = options?.method
				// const contentType = ?;
				const req = new Request('https://graphql.ozone.dev/rest/v3/graphql', { method: method, body: body }) // TODO SHA: options
				const myResult = this.client.call<string>(req)
				return myResult.then(it => {
					let obj = {}
					const jsonString = JSON.stringify(it)
					// @ts-ignore
					obj.text = () => new Promise(function(resolve, reject) { resolve(jsonString) })
					return obj as Response
				})
			}
		})

		return new ApolloClient({
			uri: `${this.baseUrl}/rest/v3/graphql`, // `https://graphql.ozone.dev/rest/v3/graphql`,
			cache: new InMemoryCache(),
			link
		})
	}
}
