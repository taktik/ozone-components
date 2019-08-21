import { assert, expect } from 'chai'
import { TypeDescriptor, FieldDescriptor } from 'ozone-type'
import sinon, { SinonFakeServer, SinonSpy } from 'sinon'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import { httpclient } from 'typescript-http-client'
import Response = httpclient.Response

describe('OzoneClient', () => {
	const wait = (timeMs: number) => new Promise(resolve => setTimeout(resolve, timeMs))
	let client: OzoneClient.OzoneClient
	let server: SinonFakeServer
	before(() => {
		const credentials = new UserCredentials('ozoneUser', 'ozonePassword')
		const config: ClientConfiguration = {
			ozoneURL: `http://my.ozone.domain/ozone`,
			ozoneCredentials: credentials
		}
		client = newOzoneClient(config)
		server = sinon.fakeServer.create()
	})
	after(() => {
		server.restore()
	})
	describe('UserClient', () => {
		describe('save', () => {
			before(() => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/user',
					xhr => {
						const user = JSON.parse(xhr.requestBody)
						user.id = 'server_ID'
						xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(user))
					})
			})
			it('should post user data', async () => {
				const userClient = client.userClient()
				const savePromise = userClient.save({
					name: 'foo',
					login: 'bare'
				})
				server.respond()
				const user = await savePromise
				assert.deepEqual(user, {
					name: 'foo',
					login: 'bare',
					id: 'server_ID'
				})
			})
		})
		describe('findOne', () => {
			before(() => {
				server.respondWith(
					'GET',
					'http://my.ozone.domain/ozone/rest/v3/user/my-ID',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'{"id": "my-ID", "name": "user1"}'
					])
			})
			it('should get user/{userId}', async () => {
				const userClient = client.userClient()
				const findPromise = userClient.findOne('my-ID')
				server.respond()
				const user = await findPromise
				assert.deepEqual(user, {
					name: 'user1',
					id: 'my-ID'
				})
			})
		})
		describe('findUsersPermissions', () => {
			before(() => {
				server.respondWith(
					'POST',
					'http://my.ozone.domain/ozone/rest/v3/user/permissions',
					[
						200,
						{ 'Content-Type': 'application/json' },
						JSON.stringify([{
							id: 'permId',
							grants: [ 'AUTHENTICATE'],
							fieldGrants: {
								additionalProp1: ['AUTHENTICATE'],
								additionalProp2: ['AUTHENTICATE'],
								additionalProp3: ['AUTHENTICATE']
							}
						}])
					])
			})
			it('should return array of FieldsPermissionUtility', async () => {
				const userClient = client.userClient()
				const findPromise = userClient.findUsersPermissions(['my-ID'])
				server.respond()
				const permissions: any = await findPromise
				assert.deepEqual(permissions[0].grant.id, 'permId')
			})
		})

		describe('getAll', () => {
			before(() => {
				server.respondWith(
					'GET',
					'http://my.ozone.domain/ozone/rest/v3/user',
					[
						200,
						{ 'Content-Type': 'application/json' },
						'[{"id": "my-ID", "name": "user1"},{"id": "id2", "name": "user2"}]'
					])
			})
			it('should get all users', async () => {
				const userClient = client.userClient()
				const findPromise = userClient.getAll()
				server.respond()
				const users = await findPromise
				assert.deepEqual(users, [{
					name: 'user1',
					id: 'my-ID'
				},{
					name: 'user2',
					id: 'id2'
				}])
			})
		})

		describe('deleteById', () => {
			before(() => {
				server.respondWith(
					'DELETE',
					'http://my.ozone.domain/ozone/rest/v3/user/my-ID',
					[
						200,
						{ 'Content-Type': 'application/json' },
						''
					])
			})
			it('should delete user/{userId}', async () => {
				const userClient = client.userClient()
				const findPromise = userClient.deleteById('my-ID')
				server.respond()
				const user = await findPromise
				assert.deepEqual(user, null)
			})
		})
		describe('patch', () => {
			before(() => {
				server.respondWith(
					'PATCH',
					'http://my.ozone.domain/ozone/rest/v3/user',
					xhr => {
						const user = JSON.parse(xhr.requestBody)
						user.name = 'server_name'
						xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(user))
					})
			})
			it('should patch user data', async () => {
				const userClient = client.userClient()
				const savePromise = userClient.patch({
					id: 'server_ID',
					login: 'bare'
				})
				server.respond()
				const user = await savePromise
				assert.deepEqual(user, {
					name: 'server_name',
					login: 'bare',
					id: 'server_ID'
				})
			})
		})
	})
})
