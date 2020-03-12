import { assert, expect } from 'chai'
import { FileType } from 'ozone-type'
import sinon, { SinonFakeServer } from 'sinon'
import { OzoneClient } from './../../src/index'
import { FiletypeCacheImpl } from './../../src/filetypeClient/filetypeClientImpl'
import UserCredentials = OzoneClient.UserCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response

describe('OzoneClient', () => {
	const wait = (timeMs: number) => new Promise(resolve => setTimeout(resolve, timeMs))
	let client: OzoneClient.OzoneClient
	let server: SinonFakeServer
	let responseHeaders = { json: { 'Content-Type': 'application/json' } }
	let fileType = { id: 'xxx-yyy', identifier: 'an-identifier' }

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
				'http://my.ozone.domain/ozone/rest/v3/filetype/identifier/an-identifier',
				[
					200,
					responseHeaders.json,
					JSON.stringify(fileType)
				])
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/filetype/identifier/identifier-unknown',
				[
					404,
					responseHeaders.json,
					JSON.stringify(fileType)
				])
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/filetype/identifier/identifier-error',
				[
					500,
					responseHeaders.json,
					JSON.stringify(fileType)
				])
		})
		it('should resolve with item ozone fileType', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.findByIdentifier('an-identifier')
			server.respond()
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal(fileType)
		})
		it('should resolve with null on 404', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.findByIdentifier('identifier-unknown')
			server.respond()
			const typeDescriptor = await resp
			assert.isNull(typeDescriptor)
		})
		it('should reject with response on error 500', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.findByIdentifier('identifier-error')
			server.respond()
			try {
				const typeDescriptor = await resp
				assert.isTrue(false, 'previous line should throw an error')
			} catch (response) {
				assert.instanceOf(response, Response)
				assert.equal(response.status, 500)
			}
		})
	})

	describe('save', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'POST',
				'http://my.ozone.domain/ozone/rest/v3/filetype',
				[
					200,
					responseHeaders.json,
					JSON.stringify({ identifier: 'newType',id: 'aaa-bbb' })
				])
		})
		it('should resolve with newType fileType', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.save({ identifier: 'newType', id: 'aaa-bbb' })
			server.respond()
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal({ identifier: 'newType', id: 'aaa-bbb' })
		})
	})
	describe('findAll', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'GET',
				'http://my.ozone.domain/ozone/rest/v3/filetype',
				[
					200,
					responseHeaders.json,
					JSON.stringify([{ identifier: 'type1', id: 'aaa-bbb' }, { identifier: 'type2', id: 'ccc-ddd' }])
				])
		})
		it('should resolve with an array of fileType', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.findAll()
			server.respond()
			const typeDescriptor = await resp
			expect(typeDescriptor).to.deep.equal([{ identifier: 'type1', id: 'aaa-bbb' }, { identifier: 'type2', id: 'ccc-ddd' }])
		})
	})
	describe('delete', () => {
		before(() => {
			// for test, its not mandatory to start the client
			// return client.start()
			server = sinon.fakeServer.create()
			server.respondWith(
				'DELETE',
				'http://my.ozone.domain/ozone/rest/v3/filetype/typeToDelete',
				[
					200,
					responseHeaders.json,
					'id'
				])
			server.respondWith(
				'DELETE',
				'http://my.ozone.domain/ozone/rest/v3/filetype/item-unknown',
				[
					404,
					responseHeaders.json,
					'id'
				])
		})
		it('should resolve with null', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.delete('typeToDelete')
			server.respond()
			const data = await resp
			expect(data).to.deep.equal(null)
		})

		it('should resolve with null on 404', async () => {
			const fileTypeClient = client.fileTypeClient()
			const resp = fileTypeClient.delete('item-unknown')
			server.respond()
			const typeDescriptor = await resp
			assert.isNull(typeDescriptor)
		})
	})

	describe('getFileTypeCache', () => {
		const fields: FileType[] = [
			{ identifier: 'aFiled', id: 'aaa-bbb' },
			{ identifier: 'bFiled', id: 'ccc-ddd' }
		]

		describe('cache management', () => {
			let serverResponseCount: number
			before(() => {
				const fields: FileType[] = [
					{ identifier: 'aFiled', id: 'aaa-bbb' },
					{ identifier: 'bFiled', id: 'ccc-ddd' }
				]

				serverResponseCount = 0
				// for test, its not mandatory to start the client
				// return client.start()
				server = sinon.fakeServer.create()
				server.respondWith(
					'GET',
					/my.ozone.domain\/ozone\/rest\/v3\/filetype/,
					(xhr: sinon.SinonFakeXMLHttpRequest) => {
						serverResponseCount++
						xhr.respond(200, responseHeaders.json, JSON.stringify(fields))
					}
				)
			})
			it('should request server information only once', async () => {
				const fileTypeClient = client.fileTypeClient()
				const typeCachePromise = fileTypeClient.getFileTypeCache()
				const typeCachePromise2 = fileTypeClient.getFileTypeCache()
				await wait(0)
				server.respond()
				expect(serverResponseCount).to.be.equal(1, 'server call mo,ne than once)')
			})
		})

		describe('fileTypes', () => {
			it('should contains all fileTypes', async () => {
				const typeCache = new FiletypeCacheImpl(client.fileTypeClient(), fields)
				expect(typeCache.fileTypes).to.deep.equal([...fields])
			})
		})

		describe('findByIdentifier', () => {
			it('should find fileType with identifier', async () => {
				const typeCache = new FiletypeCacheImpl(client.fileTypeClient(), fields)
				expect(typeCache.findByIdentifier('aFiled')).to.deep.equal({ identifier: 'aFiled', id: 'aaa-bbb' })
			})
			it('should return undefined when not identifier', async () => {
				const typeCache = new FiletypeCacheImpl(client.fileTypeClient(), fields)
				assert.isUndefined(typeCache.findByIdentifier('foo'))
			})
		})
		describe('findById', () => {
			it('should find fileType with id', async () => {
				const typeCache = new FiletypeCacheImpl(client.fileTypeClient(), fields)
				expect(typeCache.findById('aaa-bbb')).to.deep.equal({ identifier: 'aFiled', id: 'aaa-bbb' })
			})
			it('should return undefined when not identifier', async () => {
				const typeCache = new FiletypeCacheImpl(client.fileTypeClient(), fields)
				assert.isUndefined(typeCache.findById('foo'))
			})
		})

		describe('refreshCache', () => {

			it('should update fileTypes', async () => {
				const fields2: FileType[] = [
					{ identifier: 'cFiled', id: 'ccc-eee' },
					{ identifier: 'dFiled', id: 'ddd-fff' }
				]
				const fileTypeClient = client.fileTypeClient()
				const fileTypeClientMock = sinon.mock(fileTypeClient)
				fileTypeClientMock.expects('findAll').once().returns(Promise.resolve(fields2))
				const typeCache = new FiletypeCacheImpl(client.fileTypeClient(), fields)
				await typeCache.refreshCache()
				expect(typeCache.fileTypes).to.deep.equal([...fields2])
				fileTypeClientMock.verify()
			})
		})
	})
})
