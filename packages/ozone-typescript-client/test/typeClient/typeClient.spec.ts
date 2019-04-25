import { assert, expect } from 'chai'
import { TypeDescriptor, FieldDescriptor } from 'ozone-type'
import sinon, { SinonFakeServer } from 'sinon'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient

describe('OzoneClient', () => {
	const wait = (timeMs: number) => new Promise(resolve => setTimeout(resolve, timeMs))
	let client: OzoneClient.OzoneClient
	let server: SinonFakeServer
	let responseHeaders = { json: { 'Content-Type': 'application/json' } }
	let fields: FieldDescriptor[] = [{ identifier: 'aFiled',fieldType: 'aType' }]
	let type = { fields: fields }

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
	describe('findByIdentifier', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/type/item',
				[
					200,
					responseHeaders.json,
					JSON.stringify(type)
				])
		})
		it('should resolve with item typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.findByIdentifier('item')
			server.respond()
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal(type)
		})
	})

	describe('save', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'POST',
				'http://my.ozone.domain/ozone/rest/v3/type',
				[
					200,
					responseHeaders.json,
					JSON.stringify({ identifier: 'newType',fields: fields })
				])
		})
		it('should resolve with newType typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.save({ identifier: 'newType',fields: fields })
			server.respond()
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal({ identifier: 'newType',fields: fields })
		})
	})
	describe('findAll', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/type',
				[
					200,
					responseHeaders.json,
					JSON.stringify([{ identifier: 'type1',fields: fields }, { identifier: 'type2',fields: fields }])
				])
		})
		it('should resolve with an array of typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.findAll()
			server.respond()
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal([{ identifier: 'type1',fields: fields }, { identifier: 'type2',fields: fields }])
		})
	})
	describe('delete', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'DELETE',
				'http://my.ozone.domain/ozone/rest/v3/type/typeToDelete',
				[
					200,
					responseHeaders.json,
					'id'
				])
		})
		it('should resolve with newType typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.delete('typeToDelete')
			server.respond()
			const data = await resp
			expect(data).to.deep.equal(null)
		})
	})

	describe('getTypeCache', () => {
		describe('getAllFields', () => {

			const fields1: FieldDescriptor[] = [{ identifier: 'aFiled', fieldType: 'aType' }]
			const fields2: FieldDescriptor[] = [{ identifier: 'bFiled', fieldType: 'bType' }]

			before(() => {
				// for test, its not mandatory to start the client
				// return client.start()
				server = sinon.fakeServer.create()
				server.respondWith(
					'GET',
					'http://my.ozone.domain/ozone/rest/v3/type',
					[
						200,
						responseHeaders.json,
						JSON.stringify([
							{ identifier: 'itemAllFields', superType: 'itemParent', fields: fields1 },
							{ identifier: 'itemParent', fields: fields2 }
						])
					])
			})
			it('should resolve with item fieldDescriptor', async () => {
				const typeClient = client.typeClient()
				const typeCachePromise = typeClient.getTypeCache()
				await wait(0)
				server.respond()
				const typeCache = await typeCachePromise
				debugger
				const fields = typeCache.getAllFields('itemAllFields')
				expect(fields).to.deep.equal([...fields1, ...fields2])
			})
		})

		describe('isTypeInstanceOf', () => {

			before(() => {
				// for test, its not mandatory to start the client
				// return client.start()
				server = sinon.fakeServer.create()
				server.respondWith(
					'GET',
					'http://my.ozone.domain/ozone/rest/v3/type',
					[
						200,
						responseHeaders.json,
						JSON.stringify([
							{ identifier: 'itemInstance', superType: 'itemParent', fields: fields },
							{ identifier: 'itemParent', fields: fields }
						])
					])
			})
			it('should resolve with true when itemInstance is an instance of itemParent', async () => {
				const typeClient = client.typeClient()
				const typeCachePromise = typeClient.getTypeCache()
				await wait(0)
				server.respond()
				const typeCache = await typeCachePromise
				const isTypeInstanceOf = typeCache.isTypeInstanceOf('itemInstance', 'itemParent')
				assert.isTrue(isTypeInstanceOf)
			})
			it('should resolve with false when itemInstance is not an instance of itemAllFields', async () => {
				const typeClient = client.typeClient()
				const typeCachePromise = typeClient.getTypeCache()
				await wait(0)
				server.respond()
				const typeCache = await typeCachePromise
				const isTypeInstanceOf = typeCache.isTypeInstanceOf('itemInstance', 'itemAllFields')
				assert.isFalse(isTypeInstanceOf)
			})
		})
	})
})
