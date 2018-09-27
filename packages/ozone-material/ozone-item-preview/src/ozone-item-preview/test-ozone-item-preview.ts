import {OzoneItemPreview} from './ozone-item-preview'
import './ozone-item-preview'
import './test-ozone-item-preview.html'
import {assert} from 'chai'

declare function fixture<T>(element: string):T

describe('ozone-item-preview', function() {
    it('should exist', function(done) {
        var element = fixture<OzoneItemPreview>('BasicTestFixture') as OzoneItemPreview;
        assert.equal(element.tagName, 'OZONE-ITEM-PREVIEW');
        done()
    });
});
