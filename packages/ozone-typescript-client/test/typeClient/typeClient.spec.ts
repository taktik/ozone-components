import { assert, expect } from 'chai'
import { TypeDescriptor, FieldDescriptor } from 'ozone-type'
import sinon, { SinonFakeServer } from 'sinon'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import OzoneCredentials = OzoneClient.OzoneCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import { TypeClientImpl, TypeDescriptorCollection } from '../../src/typeClient/typeClientImpl'

describe('OzoneClient', () => {
	const wait = (timeMs: number) => new Promise(resolve => setTimeout(resolve, timeMs))
	let client: OzoneClient.OzoneClient
	let server: SinonFakeServer
	let responseHeaders = { json: { 'Content-Type': 'application/json' } }
	let fields: FieldDescriptor[] = [{ identifier: 'aFiled',fieldType: 'aType' }]
	let type = { fields: fields }

	before(() => {
		TypeClientImpl.typeCached = new Map<string, Promise<TypeDescriptor>>()
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
		it('should resolve with item typeDescriptor from cache', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.findByIdentifier('item')
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
		it('should have cache newType typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.findByIdentifier('newType')
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
		it('should have cache newType typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.findByIdentifier('type1')
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal({ identifier: 'type1',fields: fields })
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

			TypeClientImpl.typeCached.set(
				'typeToDelete', Promise
				.resolve({ identifier: 'typeToDelete',fields: fields })
			)
		})
		it('should resolve with newType typeDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.delete('typeToDelete')
			server.respond()
			const data = await resp
			expect(data).to.deep.equal(null)
		})
		it('should have delete cache typeToDelete from cache', async () => {
			const typeClient = client.typeClient()
			assert.isFalse(TypeClientImpl.typeCached.has('typeToDelete'))
		})
	})

	describe('getAllFields', () => {

		const fields1: FieldDescriptor[] = [{ identifier: 'aFiled',fieldType: 'aType' }]
		const fields2: FieldDescriptor[] = [{ identifier: 'bFiled',fieldType: 'bType' }]

		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/type/itemAllFields',
				[
					200,
					responseHeaders.json,
					JSON.stringify({ identifier: 'itemAllFields', superType: 'itemParent', fields: fields1 })
				])
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/type/itemParent',
				[
					200,
					responseHeaders.json,
					JSON.stringify({ identifier: 'itemParent', fields: fields2 })
				])
		})
		it('should resolve with item fieldDescriptor', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.getAllFields('itemAllFields')
			await wait(0)
			server.respond()
			await wait(10)
			server.respond()
			const fields = await resp
			expect(fields).to.deep.equal([...fields1, ...fields2])
		})
		it('should resolve with item fieldDescriptor from cache', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.getAllFields('itemAllFields')
			const fields = await resp
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
				'http://my.ozone.domain/ozone/rest/v3/type/itemInstance',
				[
					200,
					responseHeaders.json,
					JSON.stringify({ identifier: 'itemInstance', superType: 'itemParent', fields: fields })
				])
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/type/itemParent',
				[
					200,
					responseHeaders.json,
					JSON.stringify({ identifier: 'itemParent', fields: fields })
				])
		})
		it('should resolve with true when itemInstance is an instance of itemParent', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.isTypeInstanceOf('itemInstance', 'itemParent')
			await wait(0)
			server.respond()
			await wait(10)
			server.respond()
			const isTypeInstanceOf = await resp
			assert.isTrue(isTypeInstanceOf)
		})
		it('should resolve with false when itemInstance is not an instance of itemAllFields', async () => {
			const typeClient = client.typeClient()
			const resp = typeClient.isTypeInstanceOf('itemInstance', 'itemAllFields')
			await wait(0)
			server.respond()
			await wait(10)
			server.respond()
			const isTypeInstanceOf = await resp
			assert.isFalse(isTypeInstanceOf)
		})
	})

})
