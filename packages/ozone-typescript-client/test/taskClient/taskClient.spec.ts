import { assert, expect } from 'chai'
import { TypeDescriptor, FieldDescriptor } from 'ozone-type'
import sinon, { SinonFakeServer, SinonSpy } from 'sinon'
import { SearchQuery } from 'ozone-search-helper'
import { OzoneClient } from './../../src/index'
import UserCredentials = OzoneClient.UserCredentials
import ClientConfiguration = OzoneClient.ClientConfiguration
import newOzoneClient = OzoneClient.newOzoneClient
import { httpclient } from 'typescript-http-client'
import { TaskHandlerImpl, TaskClientImpl } from './../../src/taskClient/taskClientImpl'
import Response = httpclient.Response
import {File} from "gulp-typescript/release/input";
import equal = File.equal;

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
					const handler = new TaskHandlerImpl('15b0a264-4d52-43a9-a7df-aaf1bb38abf4', client, `http://my.ozone.domain/ozone`, 10)
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

					const handler = new TaskHandlerImpl('15b0a264-4d52-43a9-a7df-aaf1bb38abf4', client, `http://my.ozone.domain/ozone`, 10)
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

					const handler = new TaskHandlerImpl('15b0a264-4d52-43a9-a7df-aaf1bb38abf4', client, `http://my.ozone.domain/ozone`, 10)
					handler.onFinish = (taskExecution) => {
						expect(taskExecution).to.deep.equal({ 'taskId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','groupId': '15b0a264-4d52-43a9-a7df-aaf1bb38abf4','completed': true,'submitionDate': '1970-07-28T20:40:51.062Z','completionDate': '1970-07-28T20:40:53.624Z','stepsCount': 1,'stepsDone': 1,'taskResult': { 'archiveId': '38d88341-edf1-4a30-bc42-220b8a25bc41','archiveSize': 151858695 },'progressMessage': 'Export completed','progressPercent': 1.0 })
						done()
					}
					server.autoRespond = true
					server.respond()
				})
			})
		})
	})
})
