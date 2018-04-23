//import 'iron-test-helpers/iron-test-helpers.html'
import {MockInteractions} from 'iron-test-helpers/mock-interactions.js'
import 'iron-test-helpers/test-helpers.js'
import './taktik-free-text-search_test.html'
import {TaktikFreeTextSearch} from './taktik-free-text-search'


class MinimalSearchDemo extends Polymer.Element {

    static get is () { return "minimal-search-demo";}
}
window.customElements.define(MinimalSearchDemo.is, MinimalSearchDemo);


class MinimalSearchApi extends Polymer.Element {

    static get is () { return "minimal-search-api";}


    static get properties() {
        return {
            expectedSuggestions: {
                type: Array,
                notify: true,
                value: () => []
            },
            searchString: {
                type: String,
                notify: true
            },
            searchResults: {
                type: String,
                notify: true
            },
            auto: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return ['configSuggestion(searchString)'];
    }

    configSuggestion (){
        if(this.auto){
            this.set('searchResults', this.expectedSuggestions);
            this.dispatchEvent(new CustomEvent('results-found'))
        }
    }

    requestSearch (){
        this.set('searchResults', this.expectedSuggestions);
        this.dispatchEvent(new CustomEvent('results-found'))
    }

}
window.customElements.define(MinimalSearchApi.is, MinimalSearchApi);

describe('search-content basic behavior', () => {
    let element,
        autoCompleteAPI;


    /**
     * Array of callback to be execute ones afterEach 'it'
     * @type {Array}
     */
    let afterFunctions = [];

    beforeEach((done) => {
        const elements = fixture('basic')
        flush(done)
    });
    afterEach(() => {
        afterFunctions.map((cleanup) => {
            cleanup()
        });
        afterFunctions = [];
    });

    it('should contains search input label', () => {
        let label = Polymer
            .dom(element.shadowRoot)
            .querySelector('label');
        expect(label.textContent).to.be.equal('Search');
    });

    it('should contains search icon', () => {
        let item = Polymer
            .dom(element.shadowRoot)
            .querySelector('iron-icon');
        expect(item.getAttribute('icon')).to.be.equal('icons:search');
    });

    it('should not display suggestions result at startup', (done) => {
        // Data bindings will stamp out new DOM asynchronously
        // so wait to check for updates
        flush(() => {
            let listItems = Polymer.dom(element.root).querySelectorAll('.resultListItem');
            assert.equal(listItems.length, 0);
            done();
        });
    });

    it('should diplay suggestions result on key press', (done) => {

        autoCompleteAPI.set('expectedSuggestions',
            [
                {key:'foo', docCount:1}, {key: 'bar', docCount: 2}
            ]);
        flush(() => {
            MockInteractions.focus(element.$.searchInput);
            flush(() => {

                element.set('searchValue', 'r');

                // Data bindings will stamp out new DOM asynchronously
                // so wait to check for updates
                flush(() => {
                    debugger
                    expect(element.searchValue).to.be.equal('r');
                    expect(element.suggestions.length).to.be.equal(2);
                    expect(element.$.collapseAutoComplete.opened).to.be.equal(true);
                    let listItems = Polymer.dom(element.root).querySelectorAll('.resultListItem');
                    assert.equal(listItems.length, 2);
                    done();
                });
            });
        });
    });

    it('should fire taktik-search on press enter', (done) => {

        let expectToBeCall = (event) => {
            expect(event.detail).to.be.equal('tap enter');
            expect(element.searchValue).to.be.equal('tap enter');
            done()
        };
        afterFunctions.push(() => {
            if (element.removeEventListener) {
                element.removeEventListener('taktik-search', expectToBeCall);
            }
        });
        element.addEventListener('taktik-search', expectToBeCall);

        element.set('searchValue', 'tap enter');
        flush(() => {
            let input = element.$.searchInput;
            MockInteractions.focus(input);
            setTimeout(() => {
                MockInteractions.pressEnter(input);
            }, 500)
        });
    });

    it('should fire taktik-search on tap-on suggestion result', (done) => {

        let expectToBeCall = (event) => {
            expect(event.detail).to.be.equal('result1');
            expect(element.searchValue).to.be.equal('result1');
            done()
        };
        afterFunctions.push(() => {
            if (element.removeEventListener) {
                element.removeEventListener('taktik-search', expectToBeCall);
            }
        });
        element.addEventListener('taktik-search', expectToBeCall);
        autoCompleteAPI.set('expectedSuggestions', [
            {key:'result1', docCount:1}, {key: 'result2', docCount: 2}]);

        MockInteractions.focus(element.$.searchInput);
        element.set('searchValue', 'r');

        // Data bindings will stamp out new DOM asynchronously
        // so wait to check for updates
        flush(() => {
            let firstItem = Polymer.dom(element.root).querySelector('.resultListItem');
            MockInteractions.tap(firstItem);
        });
    });

    it('should hide suggestions result on click elsewhere', (done) => {
        element.set('searchValue', 'r');
        // Data bindings will stamp out new DOM asynchronously
        // so wait to check for updates
        flush(function () {
            MockInteractions.blur(element.$.searchInput);
            setTimeout(() => {
                expect(element.$.collapseAutoComplete.opened).to.be.equal(false);
                done();
            }, 110)

        });
    });

    it('should expose searchResults', (done) => {

        const expectedSuggestions = [{"search":"result", "object":["with", "data"]}];
        element.set('searchValue', 'ani');
        element.dispatchEvent(new CustomEvent('taktik-search', {
            bubbles: true, composed: true,
            detail: 'ani'
        }));
        // Data bindings will stamp out new DOM asynchronously
        // so wait to check for updates
        flush(function () {
            expect(element.searchResults).to.be.deep.equal(expectedSuggestions);
            done();
        });
    });

    describe('touch management', () => {

        beforeEach((done)=>{
            MockInteractions.focus(element.$.searchInput);
            autoCompleteAPI.set('expectedSuggestions',
                [
                    {key:'firstItem', docCount:10},
                    {key: 'secondItem', docCount: 2},
                    {key: 'thirdItem', docCount: 3}
                ]);
            element.set('searchValue', 'item');
            flush(done);
        });
        it('enter should append the select item and fire search', (done)=>{

            element.$.listBox.selected = 0;
            let expectedCallback = sinon.spy();
            afterFunctions.push(() => {
                if (element.removeEventListener) {
                    element.removeEventListener('taktik-search', expectedCallback);
                }
            });
            element.addEventListener('taktik-search', expectedCallback);

            MockInteractions.pressEnter(element.$.searchInput);
            flush(()=> {
                assert.isTrue(expectedCallback.called);
                assert.equal(element.searchValue, 'firstItem');
                done();
            });

        });

        it('one arrowDown press should select the first item of the list',(done)=>{
            MockInteractions.keyDownOn(element.$.searchInput, 40);
            flush(()=> {
                assert.equal(element.$.listBox.selected, 0);
                done();
            });
        });

        it('two arrowDown press should select the second item of the list', (done)=>{
            MockInteractions.keyDownOn(element.$.searchInput, 40);
            flush(()=> {
                MockInteractions.keyDownOn(element.$.searchInput, 40);
                flush(()=> {
                    assert.equal(element.$.listBox.selected, 1);
                    done();
                });
            });
        });

        it('arrowUp press should select the upper item of the list',(done)=>{
            MockInteractions.keyDownOn(element.$.searchInput, 38);
            flush(()=> {
                assert.equal(element.$.listBox.selected, 2);
                done();
            });
        });

        it('space press should append the select item to the search value',(done)=>{
            element.set('searchValue', 'fir');
            element.$.listBox.selected = 0;
            MockInteractions.pressSpace(element.$.searchInput);
            flush(()=> {
                assert.equal(element.searchValue, 'firstItem');
                done();
            });
        });

        it('escape press should remove the focus from the search input',(done)=>{
            element.$.listBox.selected = 0;
            MockInteractions.keyDownOn(element.$.searchInput, 27);
            flush(()=> {
                assert.isNotTrue(element.$.searchInput.focused);
                done();
            });
        });

        it('any assci press should remove the highlight on the suggestion list',(done)=>{
            element.$.listBox.selected = 0;
            MockInteractions.keyDownOn(element.$.searchInput, 'r'.charCodeAt(0));
            flush(()=> {
                assert.isNotTrue(element._isSuggestionHighlight());
                done();
            });
        });
        it('should remove auto-complete highlite on press enter', (done) => {
            element.$.listBox.selected = 0;
            MockInteractions.pressSpace(element.$.searchInput);
            flush(()=> {
                assert.isNotTrue(element._isSuggestionHighlight());
                done();
            });
        });

        it('should combine keywords using key press and space',(done) => {
            MockInteractions.keyDownOn(element.$.searchInput, 38);
            flush(()=> {
                MockInteractions.pressSpace(element.$.searchInput);
                flush(()=> {
                    assert.equal(element.searchValue, 'thirdItem');
                    element.set('searchValue', 'thirdItem item');
                    flush(()=> {
                        MockInteractions.keyDownOn(element.$.searchInput, 40);
                        flush(()=> {
                            MockInteractions.pressSpace(element.$.searchInput);
                            flush(()=> {
                                assert.equal(element.searchValue, 'thirdItem firstItem');
                                let expectedCallback = sinon.spy();
                                afterFunctions.push(() => {
                                    if (element.removeEventListener) {
                                        element.removeEventListener('taktik-search', expectedCallback);
                                    }
                                });
                                element.addEventListener('taktik-search', expectedCallback);

                                MockInteractions.pressEnter(element.$.searchInput);
                                flush(()=> {
                                    assert.isTrue(expectedCallback.called);
                                    assert.equal(element.searchValue, 'thirdItem firstItem');
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

    });

});