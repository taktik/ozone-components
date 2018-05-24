import {OzoneIronList} from './ozone-iron-list'
import './ozone-iron-list'
import './test-ozone-iron-list.html'

declare function fixture<T>(element: string):T

describe('ozone-iron-list', function() {
    it('should be scaffolds with love', function(done) {
        var element = fixture<OzoneIronList>('BasicTestFixture');
        assert.equal(element.tagName, 'OZONE-IRON-LIST');
        done()
    });
});
