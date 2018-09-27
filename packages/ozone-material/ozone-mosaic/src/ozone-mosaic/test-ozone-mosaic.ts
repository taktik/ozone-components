import {OzoneMosaic} from './ozone-mosaic'
import './ozone-mosaic'
import './test-ozone-mosaic.html'
import {assert} from 'chai'

declare function fixture<T>(element: string):T

describe('ozone-mosaic', function() {
    it('should be scaffolds with love', function(done) {
        var element = fixture<OzoneMosaic>('BasicTestFixture');
        assert.equal(element.tagName, 'OZONE-MOSAIC');
        done()
    });
});
