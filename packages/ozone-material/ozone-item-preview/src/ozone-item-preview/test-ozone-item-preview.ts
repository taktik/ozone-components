import { OzoneItemPreview } from './ozone-item-preview'
import './ozone-item-preview'
import './test-ozone-item-preview.html'
import { assert } from 'chai'

declare function fixture<T>(element: string): T

describe('ozone-item-preview', function() {
	before(() => {
		(window as any).ozoneClient = {
			typeClient: () => ({
				getTypeCache: () => ({})
			})
		}
	})
	it('should exist', function(done) {
		let element = fixture<OzoneItemPreview>('BasicTestFixture') as OzoneItemPreview
		assert.equal(element.tagName, 'OZONE-ITEM-PREVIEW')
		done()
	})
})
