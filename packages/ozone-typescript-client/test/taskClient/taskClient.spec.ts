import { assert, expect } from 'chai'
import sinon, { SinonFakeServer, SinonSpy } from 'sinon'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import { TaskHandlerImpl } from './../../src/taskClient/taskClientImpl'

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
	beforeEach(() => {
		// for test, its not mandatory to start the client
		// return client.start()
		server = sinon.fakeServer.create()
		let responseIndex = 0
		const responses = [
			{ 'groupid': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','stepsCount': 1,'stepsDone': 0,'hasErrors': false,'taskExecutions': { '15b0a264-4d52-43a9-a7df-aaf1bb38abf4': { 'taskId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','groupId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','completed': false,'submitionDate': '1970-07-28T20:40:51.062Z','stepsCount': 1,'stepsDone': 0,'progressMessage': 'Fetching all Referenced Items','progressPercent': 0.45 } } },
			{ 'groupid': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','stepsCount': 1,'stepsDone': 0,'hasErrors': false,'taskExecutions': { '15b0a264-4d52-43a9-a7df-aaf1bb38abf4': { 'taskId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','groupId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','completed': false,'submitionDate': '1970-07-28T20:40:51.062Z','stepsCount': 1,'stepsDone': 0,'progressMessage': 'Fetching all Blobs Ids','progressPercent': 0.6818181818181819 } } },
			{ 'groupid': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','stepsCount': 1,'stepsDone': 1,'hasErrors': false,'taskExecutions': { '15b0a264-4d52-43a9-a7df-aaf1bb38abf4': { 'taskId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','groupId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','completed': true,'submitionDate': '1970-07-28T20:40:51.062Z','completionDate': '1970-07-28T20:40:53.624Z','stepsCount': 1,'stepsDone': 1,'taskResult': { 'archiveId': '38d88341-edf1-4a30-bc42-220b8a25bc41','archiveSize': 151858695 },'progressMessage': 'Export completed','progressPercent': 1.0 } } }
		]
		server.respondWith(
			'GET',
			'http://my.ozone.domain/ozone/rest/v3/task/wait/15b0a264-4d52-43a9-a7df-aaf1bb38abf4/120',
			xhr => {
				xhr.respond(200,
					{ 'Content-Type': 'application/json' },
					JSON.stringify(responses[responseIndex++]))
			})
	})
	afterEach(() => {
		server.autoRespond = false
		server.restore()
	})
	describe('taskClient', () => {
		describe('TaskHandlerImpl', () => {
			describe('waitResult', () => {
				it('should return a task result', async () => {
					const handler = new TaskHandlerImpl('15b0a264-4d52-43a9-a7df-aaf1bb38abf4', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					server.autoRespond = true
					server.respond()
					const result = await handler.waitResult
					expect(result).to.deep.equal({
						archiveId: '38d88341-edf1-4a30-bc42-220b8a25bc41',
						archiveSize: 151858695
					})

				})
			})
			describe('onProgress', () => {
				it('should be called at each update',(done) => {

					const handler = new TaskHandlerImpl('15b0a264-4d52-43a9-a7df-aaf1bb38abf4', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					const onProgress = sinon.stub()
					handler.onProgress = onProgress
					server.autoRespond = true
					server.respond()

					setTimeout(() => {
						expect(onProgress.calledThrice)
						const results = onProgress.getCalls()
						expect(results[0].lastArg.progressPercent).to.equal(0.45)
						expect(results[1].lastArg.progressPercent).to.equal(0.6818181818181819)
						expect(results[2].lastArg.progressPercent).to.equal(1)
						done()
					}, 100)
				})
			})

			describe('onFinish', () => {
				it('should be called when task is done', (done) => {

					const handler = new TaskHandlerImpl('15b0a264-4d52-43a9-a7df-aaf1bb38abf4', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					handler.onFinish = (taskExecution) => {
						console.log(taskExecution)
						expect(taskExecution).to.deep.equal({ 'taskId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','groupId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','completed': true,'submitionDate': '1970-07-28T20:40:51.062Z','completionDate': '1970-07-28T20:40:53.624Z','stepsCount': 1,'stepsDone': 1,'taskResult': { 'archiveId': '38d88341-edf1-4a30-bc42-220b8a25bc41','archiveSize': 151858695 },'progressMessage': 'Export completed','progressPercent': 1.0 })
						done()
					}
					server.autoRespond = true
					server.respond()
				})
			})
		})
		describe('TaskHandlerImpl error mangement', () => {
			beforeEach(() => {
				// for test, its not mandatory to start the client
				// return client.start()
				server = sinon.fakeServer.create()
				let responseIndex = 0
				const responses = [
					{
						'groupid': 'task-id-with-error',
						'stepsCount': 1,
						'stepsDone': 0,
						'hasErrors': false,
						'taskExecutions': {
							'task-id-with-error': {
								'taskId': 'task-id-with-error',
								'groupId': 'task-id-with-error',
								'completed': false,
								'submitionDate': '1970-07-28T20:40:51.062Z',
								'stepsCount': 1,
								'stepsDone': 0,
								'progressMessage': 'Fetching all Referenced Items',
								'progressPercent': 0.45
							}
						}
					},
					{
						'groupid': 'task-id-with-error',
						'stepsCount': 1,
						'stepsDone': 0,
						'hasErrors': false,
						'taskExecutions': {
							'task-id-with-error': {
								'taskId': 'task-id-with-error',
								'groupId': 'task-id-with-error',
								'completed': false,
								'submitionDate': '1970-07-28T20:40:51.062Z',
								'stepsCount': 1,
								'stepsDone': 0,
								'progressMessage': 'Fetching all Blobs Ids',
								'progressPercent': 0.6818181818181819
							}
						}
					},
					{
						'groupid': 'task-id-with-error',
						'stepsCount': 1,
						'stepsDone': 1,
						'hasErrors': true,
						'taskExecutions': {
							'task-id-with-error': {
								'taskId': 'task-id-with-error',
								'groupId': 'task-id-with-error',
								'completed': true,
								'submitionDate': '1970-07-28T20:40:51.062Z',
								'completionDate': '1970-07-28T20:40:53.624Z',
								'stepsCount': 1,
								'stepsDone': 1,
								'error': 'An error occurs',
								'progressPercent': 0.90
							}
						}
					}
				]
				server.respondWith(
					'GET',
					'http://my.ozone.domain/ozone/rest/v3/task/wait/task-id-with-error/120',
					xhr => {
						xhr.respond(200,
							{ 'Content-Type': 'application/json' },
							JSON.stringify(responses[responseIndex++]))
					})
			})
			describe('onError', () => {
				it('should be called when task has an error', (done) => {

					const handler = new TaskHandlerImpl('task-id-with-error', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					handler.onError = (taskExecution) => {
						expect(taskExecution).to.deep.equal({
							'taskId': 'task-id-with-error',
							'groupId': 'task-id-with-error',
							'completed': true,
							'submitionDate': '1970-07-28T20:40:51.062Z',
							'completionDate': '1970-07-28T20:40:53.624Z',
							'stepsCount': 1,
							'stepsDone': 1,
							'error': 'An error occurs',
							'progressPercent': 0.90
						})
						done()
					}
					server.autoRespond = true
					server.respond()
				})
			})
			describe('waitResult', () => {
				it('should throw an exception when task has an error', async () => {

					const handler = new TaskHandlerImpl('task-id-with-error', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					server.autoRespond = true
					server.respond()
					try {
						await handler.waitResult
						expect(true).to.equal(false, 'wait result should not resolve')
					} catch (error) {
						expect(error.message).to.equal('An error occurs')
					}
				})
			})
			describe('stopWaiting', () => {
				it('should cancel ozone call and call onError',(done) => {
					const handler = new TaskHandlerImpl('task-to-cancel', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					handler.onError = (taskExecution) => {
						expect(taskExecution).to.deep.equal({ error: 'Wait for task canceled' })
						expect(server.requests).to.have.lengthOf(0)
						done()
					}
					handler.stopWaiting()
				})
				it('should cancel ozone call and reject waitResult',(done) => {
					const handler = new TaskHandlerImpl('task-to-cancel', client, `http://my.ozone.domain/ozone`, { pollInterval: 10 })
					handler.waitResult
						.catch((taskExecution) => {
							expect(taskExecution).to.deep.equal({ error: 'Wait for task canceled' })
							expect(server.requests).to.have.lengthOf(0)
							done()
						})
					handler.stopWaiting()
				})
			})
		})
	})
})
