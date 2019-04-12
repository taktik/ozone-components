import { assert } from 'chai'
import sinon, { SinonFakeServer } from 'sinon'

import { OzoneClient } from './../src/index'
import UserCredentials = OzoneClient.UserCredentials
import OzoneCredentials = OzoneClient.OzoneCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient


describe('OzoneClient', () => {
	let client: OzoneClient.OzoneClient
	let server: SinonFakeServer

	before( ()  => {
		server = sinon.fakeServer.create()
		const credentials = new UserCredentials('ozoneUser', 'ozonePassword')
		const config: ClientConfiguration = {
			ozoneURL: `http://my.ozone.domain/ozone`,
			ozoneCredentials: credentials
		}
		client = newOzoneClient(config)
		// for test, its not mandatory to start the client
		//return client.start()
	})
	describe('ItemClient', () => {
		describe('broadcast', () => {
			it('shoud send broadcast request', async () => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/an.ozone.type/broadcast',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'{ "id": "uuid", "data": "some", "_meta": {"state": "OK"} }'
					]
				)
				const api = client.itemClient<any>('an.ozone.type')
				const resp = api.broadcast({ "id": "uuid", "data": "some"})
				server.respond()
				const data = await resp
				assert.deepEqual(data, { "id": "uuid", "data": "some", "_meta": { "state": "OK" } })
			})
			it('shoud throw an error if meta state error', async () => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/an.ozone.type/broadcast',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'{ "id": "uuid", "data": "some", "_meta": {"state": "ERROR"} }'
					]
				)
				const api = client.itemClient<any>('an.ozone.type')
				const resp = api.broadcast({ "id": "uuid", "data": "some" })
				server.respond()
				try{
					const data = await resp
					assert.isTrue(false, 'previous line should throw an error')
				} catch (err) {
					assert.deepEqual(err, { "id": "uuid", "data": "some", "_meta": { "state": "ERROR" } })
				}
			})

		})

		describe('bulkBroadcast', () => {
			it('shoud send bulkBroadcast request', async () => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/an.ozone.type/bulkBroadcast',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'[{ "id": "uuid", "data": "some", "_meta": {"state": "OK"} }]'
					]
				)
				const api = client.itemClient<any>('an.ozone.type')
				const resp = api.bulkBroadcast([{ "id": "uuid", "data": "some"}])
				server.respond()
				const data = await resp
				assert.deepEqual(data, [{ "id": "uuid", "data": "some", "_meta": {"state": "OK"} }])
			})
			it('shoud throw an error if meta state error', async () => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/an.ozone.type/bulkBroadcast',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'[{ "id": "uuid", "data": "some", "_meta": {"state": "ERROR"} }]'
					]
				)
				const api = client.itemClient<any>('an.ozone.type')
				const resp = api.bulkBroadcast([{ "id": "uuid", "data": "some"}])
				server.respond()
				try{
					const data = await resp
					assert.isTrue(false, 'previous line should throw an error')
				} catch (err) {
					assert.deepEqual(err, [{"id": "uuid", "data": "some", "_meta": {"state": "ERROR"}}])
				}
			})
		})
	})

})
