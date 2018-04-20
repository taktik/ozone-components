

import "iron-test-helpers/iron-test-helpers.html"
import {MockInteractions} from 'iron-test-helpers/mock-interactions.js'
import  '../taktik-free-text-search/taktik-free-text-search.ts'
import  '../ozone-api-search/ozone-api-search.ts'
import {OzoneFreeTextSearch} from"./ozone-free-text-search.ts"
import "./ozone-free-text-search_test.html"

class FakeTaktikSearch extends Polymer.Element {

    static get is () { return "fake-taktik-search"; }

    static get properties() {
        return {
            searchValue: 'String',
            searchResults: {
                type: Array,
                notify: true,
                readOnly: true
            },
            showItemCount: {
                type: Boolean,
                value: false
            }
        };
    }

    constructor() {
        super();
        this.registerAutoCompleteAPI = sinon.spy();
        this.registerSearchAPI = sinon.spy();
    }
}
window.customElements.define(FakeTaktikSearch.is, FakeTaktikSearch);

describe('search-content basic behavior', () => {
    let element,
        server;

    /**
     * Array of callback to be execute ones afterEach 'it'
     * @type {Array}
     */
    let afterFunctions = [];

    beforeEach((done) => {
        //replace('taktik-free-text-search').with('fake-taktik-search');
        server = sinon.fakeServer.create();

        stub('taktik-free-text-search', {
            registerAutoCompleteAPI: sinon.spy(),
            registerSearchAPI: sinon.spy(),
        });
        element = fixture('basic');

        flush(done)
    });
    afterEach(() => {
        afterFunctions.map((cleanup) => {
            cleanup()
        });
        afterFunctions = [];
    });

    it('should bind searchValue to taktik-free-text-search', (done) => {
        element.set('searchValue', 'a new serach value');

        expect(element.$.freeTextSearch.searchValue).to.be.equal('a new serach value');
        done()
    });

    it('should bind showItemCount to taktik-free-text-search', (done) => {
        element.set('showItemCount',true);

        assert.isTrue(element.$.freeTextSearch.showItemCount);
        done()
    });

    it('should expose searchResults',(done) => {
        element.$.freeTextSearch.set('searchResults', ['an', 'array', 'of', 'results']);

        expect(element.searchResults).to.be.deep.equal(['an', 'array', 'of', 'results']);

        done();
    });

    it('should register AutoCompleteAPI in taktikFreeTextSearch',(done) => {
        assert.isTrue(element.$.freeTextSearch
            .registerAutoCompleteAPI
            .calledWithExactly(element.$.ozoneAutoComplete));

        done()
    });

    it('should register SearchAPI in taktikFreeTextSearch',(done) => {
        assert.isTrue(element.$.freeTextSearch
            .registerSearchAPI
            .calledWithExactly(element.$.ozoneSearchItem));

        done()
    });

});
