var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("ozone-collection", ["require", "exports", "taktik-polymer-typeScript", "ozone-api-item", "ozone-search-helper"], function (require, exports, taktik_polymer_typeScript_1, ozone_api_item_1, ozone_search_helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * <ozone-collection> is a generic component to manage collection of item.
     */
    let OzoneCollection = class OzoneCollection extends Polymer.Element {
        get _getSource() { return this._source; }
        ;
        static get properties() {
            return {
                sourceId: {
                    type: String,
                    observer: "_updateSource"
                },
                items: {
                    type: Array,
                    notify: true,
                    value: () => []
                },
                _searchIterator: {
                    type: Object
                },
                total: {
                    type: Number,
                    notify: true
                },
                dataRemain: {
                    type: Boolean,
                    notify: true,
                    value: false
                }
            };
        }
        ready() {
            super.ready();
            if (!this._source) {
                this._source = ozone_api_item_1.getOzoneApiItem();
            }
        }
        _updateSource(sourceId) {
            if (!(this.parentNode == null)) {
                this._source = this.parentNode.querySelector(`#${this.sourceId}`);
            }
        }
        /**
         * load first collection items
         * items are added to the items array.
         * @param size {number} number of items to load default value is 10
         */
        loadItems(size) {
            this.quickSearch('', size);
        }
        /**
         * quick search for items in the collection.
         * @param searchString
         * @param size {number} number of items to load default value is 10
         */
        quickSearch(searchString, size) {
            size = size || 10;
            let searchQuery = new ozone_search_helper_1.SearchQuery();
            searchQuery.size = size;
            searchQuery.quicksearch(searchString);
            this.search(searchQuery);
        }
        /**
         * Start a complex search on the collection
         * found items are added to the items array.
         * @param searchQuery {SearchQuery} search query
         */
        search(searchQuery) {
            this._verifySource();
            this._searchIterator = this._getSource.search(searchQuery);
            this.loadNextItems();
        }
        /**
         * query next search result from ozone.
         * found items are added to the items array.
         * @return {Promise}
         */
        loadNextItems() {
            if (this._searchIterator) {
                return this._searchIterator.next().then((searchResult) => {
                    this.set('dataRemain', this._searchIterator.done);
                    this.set('total', searchResult.total);
                    searchResult.results.forEach((item) => {
                        this.push('items', item);
                    });
                });
            }
            return Promise.reject('_searchIterator not define you probably did not search for items');
        }
        /**
         * find one item in ozone collection.
         * The item found is added in the items array.
         * @param id {uuid} id of the item to get.
         * @return {Promise<Item>} promise resolve with the item or null (if not found).
         */
        findOne(id) {
            try {
                this.isDefined(id);
                const index = this.getIndexById(id);
                let result;
                if (index < 0) {
                    this._verifySource();
                    result = this._getSource.getOne(id)
                        .then(item => {
                        if (item) {
                            this.push('items', item);
                        }
                        return item;
                    });
                }
                else {
                    result = Promise.resolve(this.items[index]);
                }
                return result;
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        isDefined(param) {
            if (!param)
                throw new TypeError('parameter is undefined');
        }
        /**
         * save all items present in items on ozone.
         * items are updated with the result of the save.
         * @return {Promise<Array<Items>>} promise resolve with the list io items saved.
         */
        saveAll() {
            try {
                this._verifySource();
                return this._getSource.bulkSave(this.items)
                    .then(items => {
                    this.set('items', items);
                    return items;
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        /**
         * get index of an id in items
         * @param id {uuid} id of the item
         * @return {number} index of the item in items. -1 when not found.
         */
        getIndexById(id) {
            let index = -1;
            if (id) {
                index = this.items.findIndex(item => item.id == id);
            }
            return index;
        }
        /**
         * save one item in ozone.
         * result is reflect in items.
         * @param {Item} item to save.
         * @param reflect {boolean} reflect change from ozone in items list
         * @return {Promise<number>} Promise resolve with index of the item in items.
         */
        saveOne(item, reflect = true) {
            try {
                this.isDefined(item);
                const index = this.getIndexById(item.id);
                let result;
                if (index > -1) {
                    this._verifySource();
                    result = this._getSource.update(item)
                        .then(item => {
                        //this.items[index] = item;
                        this.splice('items', index, 1, item);
                        return index;
                    });
                }
                else {
                    result = this.add(item);
                }
                return result;
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        /**
         * Create a new item in the collection
         * @param item
         * @param reflect {boolean} reflect change from ozone in items list
         * @return {Promise<number>} promise the resolve with the index in items
         */
        add(item, reflect = true) {
            try {
                this.isDefined(item);
                this._verifySource();
                return this._getSource.create(item)
                    .then(item => {
                    if (reflect) {
                        this.push('items', item);
                    }
                    return this.items.length - 1;
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        /**
         * delete all items store in items from ozone.
         * @param reflect {boolean} reflect change from ozone in items list
         * @return {Promise}
         */
        deleteAll(reflect = true) {
            try {
                this._verifySource();
                const ids = this.items.map(item => item.id);
                return this._getSource.bulkDelete(ids)
                    .then((result) => {
                    if (reflect) {
                        this.set('items', []);
                    }
                    return result;
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        /**
         * Delete from ozone a list of item.
         * @param ids {Array<uuid>} list of id to delete from ozone.
         * @param reflect {boolean} reflect change from ozone in items list
         * @return {any}
         */
        deleteItems(ids, reflect = true) {
            try {
                this.isDefined(ids);
                this._verifySource();
                this._verifySource();
                return this._getSource.bulkDelete(ids)
                    .then((ids) => {
                    if (reflect) {
                        ids.map(id => {
                            this._removeOne(id);
                        });
                    }
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        /**
         * delete one item from ozone.
         * @param id {uuid} id to delete
         * @param reflect {boolean} reflect change from ozone in items list
         * @return {any}
         */
        deleteOne(id, reflect = true) {
            try {
                this.isDefined(id);
                this._verifySource();
                return this._getSource.deleteOne(id)
                    .then((id) => {
                    if (reflect) {
                        this._removeOne(id);
                    }
                });
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        _removeOne(id) {
            const index = this.getIndexById(id);
            if (index > -1) {
                this.splice('items', index, 1);
            }
        }
        _verifySource() {
            if (!this._source) {
                throw new Error('Invalid source');
            }
        }
    };
    __decorate([
        taktik_polymer_typeScript_1.domElement(),
        __metadata("design:type", Object)
    ], OzoneCollection.prototype, "$", void 0);
    OzoneCollection = __decorate([
        taktik_polymer_typeScript_1.customElement('ozone-collection')
    ], OzoneCollection);
    exports.OzoneCollection = OzoneCollection;
});
