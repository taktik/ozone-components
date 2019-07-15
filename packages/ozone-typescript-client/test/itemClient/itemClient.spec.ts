import { assert, expect } from 'chai'
import { TypeDescriptor, FieldDescriptor } from 'ozone-type'
import sinon, { SinonFakeServer, SinonSpy } from 'sinon'
import { SearchQuery } from 'ozone-search-helper'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response

describe('OzoneClient', () => {
	let client: OzoneClient.OzoneClient
	let server: SinonFakeServer

	before(() => {
		const credentials = new UserCredentials('ozoneUser', 'ozonePassword')
		const config: ClientConfiguration = {
			ozoneURL: `http://my.ozone.domain/ozone`,
			ozoneCredentials: credentials
		}
		client = newOzoneClient(config)
	})
	after(() => {
		server.restore()
	})
	describe('itemClient', () => {
		describe('searchGenerator', () => {
			const collectionResult = [
				{ results: [{ item: 1 }, { item: 2 }], total: 6 , size: 2 },
				{ results: [{ item: 3 }, { item: 4 }], total: 6 , size: 4 },
				{ results: [{ item: 5 }, { item: 6 }], total: 6 , size: 6 }
			]
			before(() => {
				// for test, its not mandatory to start the client
				// return client.start()
				server = sinon.fakeServer.create()
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/item/search',
					xhr => {
						console.log(xhr.requestBody)
						xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({ results: [{ item: 1 }], total: 1 , size: 1 }))
					})

				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/collection/search',
					xhr => {
						console.log(xhr.requestBody)
						const request = JSON.parse(xhr.requestBody)
						const index = ((request.offset || 0) / request.size) >> 0 // integer division
						xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(collectionResult[index]))
					})
			})
			it('should return a generator', async () => {
				const itemApi = client.itemClient('item')
				const searchQuery = new SearchQuery()
				searchQuery.termQuery('foo', 'bar')
				const searchGen: any = itemApi.searchGenerator(searchQuery)
				const res1Promise = searchGen.next()
				server.respond()
				const res1 = await res1Promise
				expect(res1.value).to.deep.equal({ results: [{ item: 1 }], total: 1 , size: 1 })
				const res2 = await searchGen.next()
				expect(res2.done).to.equal(true)
			})
			it('should iterate on all the results', async () => {
				const itemApi = client.itemClient('collection')
				const searchQuery = new SearchQuery()
				searchQuery.termQuery('foo', 'bar').size = 2
				server.autoRespond = true
				let expectedResponseIndex = 0

				for await (const result of itemApi.searchGenerator(searchQuery)) {
					expect(result).to.deep.equal(collectionResult[expectedResponseIndex++])
				}
				expect(expectedResponseIndex).to.equal(3)
			})
			it('should go to given offset', async () => {
				const itemApi = client.itemClient('collection')
				const searchQuery = new SearchQuery()
				const pageSize = 2
				searchQuery.termQuery('foo', 'bar').size = pageSize

				const searchGen: any = itemApi.searchGenerator(searchQuery)
				const res1Promise = searchGen.next()
				server.respond()
				const res1 = await res1Promise
				expect(res1.value).to.deep.equal({ results: [{ item: 1 }, { item: 2 }], total: 6 , size: 2 })
				const lastOffset = res1.value.total - pageSize
				expect(lastOffset).to.equal(4)

				const res2Promise = searchGen.next(lastOffset)
				server.respond()
				const res2 = await res2Promise
				expect(res2.value).to.deep.equal({ results: [{ item: 5 }, { item: 6 }], total: 6 , size: 6 })

				const res3Promise = searchGen.next(2)
				server.respond()
				const res3 = await res3Promise
				expect(res3.value).to.deep.equal({ results: [{ item: 3 }, { item: 4 }], total: 6 , size: 4 })
			})
		})
	})
})
