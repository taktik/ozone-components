/// <amd-module name="ozone-api-item"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("ozone-api-item", ["require", "exports", "decorators", "ozone-search-helper"], function (require, exports, taktik_polymer_typeScript_1, ozone_search_helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * `ozone-api-item` is low level polymer module to ozone api.
     * It provide CRUD operation and search in a given collection.
     *
     * By default a `ozone-api-item` will be add in the root document
     * and can loaded form javaScript using *getOzoneApiItem*
     *
     * * Example in Html
     * ```html
     * <ozone-api-search id="myAPI" collection="item"></ozone-api-search>
     * ```
     * * Example
     * ```javaScript
     * const ozoneApiSearch = getOzoneApiItem(); // return instance of OzoneApiItem located in the dom
     * ```
     *
     * ### Events
     *
     * *configured* Fired when element is configured.
     *  This event will be fired if the config change.
     *
     */
    let OzoneApiItem = class OzoneApiItem extends OzoneApiAjaxMixin(Polymer.Element) {
        /**
         * `ozone-api-item` is low level polymer module to ozone api.
         * It provide CRUD operation and search in a given collection.
         *
         * By default a `ozone-api-item` will be add in the root document
         * and can loaded form javaScript using *getOzoneApiItem*
         *
         * * Example in Html
         * ```html
         * <ozone-api-search id="myAPI" collection="item"></ozone-api-search>
         * ```
         * * Example
         * ```javaScript
         * const ozoneApiSearch = getOzoneApiItem(); // return instance of OzoneApiItem located in the dom
         * ```
         *
         * ### Events
         *
         * *configured* Fired when element is configured.
         *  This event will be fired if the config change.
         *
         */
        constructor() {
            super(...arguments);
            this._readItemResponse = (res) => res.response;
            this._readBulkItemResponse = (res) => {
                return res.response;
            };
        }
        static get properties() {
            return {
                collection: {
                    type: String,
                    notify: false,
                    value: 'item'
                }
            };
        }
        static get observers() {
            return [
                '_collectionChange(collection, config.endPoints.*)'
            ];
        }
        /**
         * observer on collection
         * @private
         */
        _collectionChange(collection, endpoints) {
            if (collection && endpoints.value && this.config) {
                this.computeServiceUrl(endpoints.value[collection]);
                this.dispatchEvent(new CustomEvent('configured', { bubbles: true, composed: true }));
            }
        }
        /**
         * Create or update a collection item.
         * @param data Item item to create.
         * @return {Promise<Item>}
         */
        create(data) {
            return this.update(data);
        }
        /**
         * Create or update a collection item.
         * @param data Item item to update.
         * @return {Promise<Item>}
         */
        update(data) {
            const url = this._buildUrl('');
            return this._postRequest(url, data, this._readItemResponse);
        }
        /**
         * get one collection item by uuid.
         * @param id
         * @return {Promise<Item | null>}
         */
        getOne(id) {
            const url = this._buildUrl(id);
            return this._getRequest(url)
                .then(response => {
                if (response == '') {
                    return null;
                }
                else {
                    return response;
                }
            });
        }
        /**
         * delete one collection item by uuid.
         * @param id
         * @return {Promise<any>}
         */
        deleteOne(id) {
            const url = this._buildUrl(id);
            return this._deleteRequest(url);
        }
        /**
         * get collection items from a list of id.
         * @param ids {Array<uuid>} array of id to get
         * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
         */
        bulkGet(ids) {
            const url = this._buildUrl('bulkGet');
            return this._postRequest(url, ids, this._readBulkItemResponse);
        }
        /**
         * delete items from a list of id.
         * @param ids
         * @return {Promise<Array<uuid>>} promise resole with an array of deleted id
         */
        bulkDelete(ids) {
            const url = this._buildUrl('bulkDelete');
            return this._postRequest(url, ids, this._readItemResponse);
        }
        /**
         * save an array of items
         * @param items
         * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
         */
        bulkSave(items) {
            const url = this._buildUrl('bulkSave');
            return this._postRequest(url, items, this._readBulkItemResponse);
        }
        /**
         * Submit ozone search query
         */
        search(search) {
            const url = this._buildUrl('search');
            return new ozone_search_helper_1.SearchGenerator(url, search, this.$.ozoneAccess);
        }
        _postRequest(url, body, responseFilter) {
            this.$.ozoneAccess.url = url;
            this.$.ozoneAccess.method = 'POST';
            this.$.ozoneAccess.body = JSON.stringify(body);
            return this.$.ozoneAccess
                .generateRequest().completes.then(responseFilter.bind(this));
        }
        _getRequest(url) {
            this.$.ozoneAccess.url = url;
            this.$.ozoneAccess.method = 'GET';
            return this.$.ozoneAccess
                .generateRequest().completes.then((res) => res.response);
        }
        _deleteRequest(url) {
            this.$.ozoneAccess.url = url;
            this.$.ozoneAccess.method = 'DELETE';
            return this.$.ozoneAccess
                .generateRequest().completes.then((res) => res.response);
        }
        _buildUrl(action) {
            return `${this.serviceUrl}/${action}`;
        }
    };
    __decorate([
        taktik_polymer_typeScript_1.domElement(),
        __metadata("design:type", Object)
    ], OzoneApiItem.prototype, "$", void 0);
    OzoneApiItem = __decorate([
        taktik_polymer_typeScript_1.customElement('ozone-api-item')
    ], OzoneApiItem);
    exports.OzoneApiItem = OzoneApiItem;
    function OzoneApiItemGenerator() {
        let ozoneItemAPI;
        return () => {
            if (!document.querySelector('#ozoneItemAPI')) {
                ozoneItemAPI = document.createElement('ozone-api-item');
                ozoneItemAPI.id = 'ozoneItemAPI';
                document.body.appendChild(ozoneItemAPI);
            }
            return document.querySelector('#ozoneItemAPI');
        };
    }
    /**
     * return OzoneApiItem singleton
     * @type {()=>OzoneApiItem}
     */
    exports.getOzoneApiItem = OzoneApiItemGenerator();
});
