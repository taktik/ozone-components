import { assert } from 'chai'
import sinon, { SinonFakeServer } from 'sinon'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import OzoneCredentials = OzoneClient.OzoneCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import {FieldsPermission} from "../../src/permissionClient/permissionClient";


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
		// return client.start()
	})

	after(() => {
		server.restore()
	})
	describe('permissionClient', () => {
		describe('bulkGetPermissions', () => {
			it('shoud send POST request permission', async () => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/bulkGetPermissions?fields=name',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'[ {"id": "item_id_1", "grants": ["FIELD_EDIT", "FIELD_VIEW"], "fieldGrants": {"name": ["FIELD_EDIT", "FIELD_VIEW"]}}, {"id": "item_id_2", "grants": ["FIELD_VIEW"], "fieldGrants": {"name": ["FIELD_VIEW"]}}]'
					]
				)
				const api = client.permissionClient()
				const resp = api.bulkGetPermissions([
					{identifier:'name'} as any,
					//{identifier:'f_id2'},
				], ['item_id_1', 'item_id_2'] )
				server.respond()
				const data: Map<string, FieldsPermission> = await resp
				assert.deepEqual(data.get('item_id_1')!.grant, {"id": "item_id_1", "grants": ["FIELD_EDIT", "FIELD_VIEW"], "fieldGrants": {"name": ["FIELD_EDIT", "FIELD_VIEW"]}} as any)
				assert.isTrue((data.get('item_id_1')as any).isFieldEditable('name'))
				assert.isFalse(data.get('item_id_2')!.isFieldEditable('name'))
			})
		})
		describe('getPermissions', () => {
			it('shoud send POST request permission', async () => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/items/bulkGetPermissions?fields=name',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'[ {"id": "item_id_1", "grants": ["FIELD_EDIT", "FIELD_VIEW"], "fieldGrants": {"name": ["FIELD_EDIT", "FIELD_VIEW"]}}]'
					]
				)
				const api = client.permissionClient()
				const resp = api.getPermissions([
					{identifier:'name'} as any,
					//{identifier:'f_id2'},
				], 'item_id_1' )
				server.respond()
				const data = await resp
				assert.deepEqual(data.grant, {"id": "item_id_1", "grants": ["FIELD_EDIT", "FIELD_VIEW"], "fieldGrants": {"name": ["FIELD_EDIT", "FIELD_VIEW"]}} as any)
				assert.isTrue(data.isFieldEditable('name'))
			})
		})
	})
})
