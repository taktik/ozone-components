import { expect, assert } from 'chai'
import * as sinon from 'sinon'
import { OzoneConfig } from '../src/ozone-config'

describe('ozone-config tests', function() {
	let server: sinon.SinonFakeServer
	let responseHeaders: any = { json: { 'Content-Type': 'application/json' } }

	beforeEach(() => {
		server = sinon.fakeServer.create()
	})

	it('should request ozone config file and expose config in configPromise', (done) => {
		// -- Configure mock server
		server.respondWith(
		'GET',
		'./conf.ozone.json',
			[
				200,
				responseHeaders.json,
				'{"ozoneApi": {"server": "https://alpha.flowr.cloud/","endpoint": "ozone/"}}'
			]
		)
		// -- start test
		OzoneConfig.get().then(function(config) {
			expect(config).to.deep.equal({ server: 'https://alpha.flowr.cloud/',endpoint: 'ozone/' })
		})
		.then(() => done())
		.catch((e) => {
			done(e)
		})
		server.respond() // Flush server
	})

	it('should catch error in configPromise', (done) => {
		// -- Configure mock server
		server.respondWith(
			'GET',
			'./conf.ozone.json',
			[
				400,
				responseHeaders.json,
				''
			]
		);
		// -- start test
		(OzoneConfig as any).configPromise = null
		OzoneConfig.get().catch((event) => {
			assert.isDefined(event)
			done()
		})
		server.respond() // Flush server
	})
});
