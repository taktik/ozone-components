import "polymer/polymer.html"
import "polymer/polymer-element.html"

import "./ozone-collection.html"

import {customElement, property, observe, jsElement} from 'taktik-polymer-typescript';
import {Item} from 'ozone-type';
import 'ozone-api-item';
import {SearchGenerator, OzoneApiItem, lockRequest, StatefulOzone} from 'ozone-api-item';
import 'ozone-search-helper';
import {SearchQuery, SearchResult} from 'ozone-search-helper';


/**
 * <ozone-collection> is a generic component to manage collection of item.
 *
 * ## usage
 *
 * ```html
 *        <ozone-collection
 *        id="mosaicCollection"
 *        items="{{searchResults}}"
 *        total="{{total}}"
 *        collection="video"
 *        has-more-data="{{hasMoreData}}"></ozone-collection>
 * ```
 * ### Events
 *
 * *collection-property-changed* fire on attribute change. details contain {name:string, value:any}
 *
 */
@customElement('ozone-collection')
export class OzoneCollection extends Polymer.Element implements StatefulOzone{

    _currentRequest: Promise<any> = Promise.resolve();

    $: {
        scrollTheshold: {
            clearTriggers(): void
        }
    } | undefined;


    /**
     * collection of the OzoneApiItem to be use as source
     * By default it use default item collection
     */
    @property({type: String, observer: "updateSource"})
    collection: string = 'item';

    /**
     * Array of items loaded from the source
     * @notify: true
     */
    @property({type: Array, notify: true})
    items: Array<Item> = [];

    /**
     * total number of results found in ozone
     * @notify: true
     */
    @property({type: Number, notify: true})
    total: Number = 0;

    /**
     * true if there is still data to be loaded in the collection.
     * @notify: true
     */
    @property({type: Boolean, notify:true})
    hasMoreData: boolean = false;

    /**
     * map function run on search result received from the server.
     * Useful form migration task
     */
    mapSearchResult: {(item:Item): Item} | undefined;

    private _source: OzoneApiItem;

    private get _getSource() {return this._source as OzoneApiItem};

    private _searchIterator?: SearchGenerator;

    constructor(){
        super();
        this._source = new OzoneApiItem();
    }


    updateSource(collection: string){
        this.collection = collection;
        this._source.setCollection(this.collection);
    }

    /**
     * load first collection items
     * items are added to the items array.
     * @param size {number} number of items to load default value is 10
     */
    async loadItems(size:number): Promise<Array<Item>>{
        return this.quickSearch('', size);
    }

    /**
     * quick search for items in the collection.
     * @param searchString
     * @param size {number} number of items to load default value is 10
     */
    async quickSearch(searchString:string, size?:number): Promise<Array<Item>>{
        size = size || 10;
        let searchQuery = new SearchQuery();
        searchQuery.size = size;
        searchQuery.quicksearch(searchString);
        return this.search(searchQuery);
    }

    /**
     * Start a complex search on the collection
     * found items are added to the items array.
     * @param searchQuery {SearchQuery} search query
     * @param keepData {Boolean} keep items in collection. Default is false, it will delete items before search.
     */
    async search(searchQuery:SearchQuery, keepData: boolean = false): Promise<Array<Item>>{
        this._verifySource();

        if(this._searchIterator){
            this._searchIterator.cancelRequest()
        }

        this._searchIterator = (await this._getSource.search(searchQuery)) as SearchGenerator;
        return this.loadNextItems(keepData)
    }

    /**
     * query next search result from ozone.
     * found items are added to the items array.
     * @return {Promise}
     */
    @lockRequest()
    async loadNextItems(keepData: boolean = true): Promise<Array<Item>>{
        if(this._searchIterator) {
            return this._addSearchResult(await this._searchIterator.next(), keepData);
        }
        return Promise.reject('_searchIterator not define you probably did not search for items')
    }

    /**
     * query all search result from ozone.
     * found items are added to the items array.
     * @return {Promise}
     */
    @lockRequest()
    async loadAll(keepData: boolean = true): Promise<Array<Item>>{
        if(this._searchIterator) {
            return this._addSearchResult(await this._searchIterator.getAll(), keepData);
        }
        return Promise.reject('_searchIterator not define you probably did not search for items')
    }

    private async _addSearchResult  (searchResult: SearchResult| null , keepData: boolean): Promise<Array<Item>> {
        if (this._searchIterator) {
            this.set('hasMoreData', this._searchIterator.hasMoreData);
            if(searchResult) {
                let resultsList: Array<Item>;
                if (this.mapSearchResult) {
                    resultsList = searchResult.results.map(this.mapSearchResult);
                } else {
                    resultsList = searchResult.results;
                }

                if(!keepData){
                    await this.clear()
                }
                this.set('total', searchResult.total);
                this.push('items', ...resultsList)
            }
        }
        return this.items;
    }
    /**
     * find one item in ozone collection.
     * The item found is added in the items array.
     * @param id {uuid} id of the item to get.
     * @return {Promise<Item>} promise resolve with the item or null (if not found).
     */
    @lockRequest()
    findOne(id:uuid): Promise<Item | null>{
        try {
            this.isDefined(id);

            const index = this.getIndexById(id);
            let result;
            if (index < 0) {
                this._verifySource();
                result = this._getSource.getOne(id)
                    .then(item => {
                        if (item) {
                            this.splice('items', 0, 0, item);
                        }
                        return item as Item | null;
                    });
            } else {
                result = Promise.resolve(this.items[index]);
            }
            return result
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private isDefined(param: any) {
        if (!param) throw new TypeError('parameter is undefined');
    }

    /**
     * save all items present in items on ozone.
     * items are updated with the result of the save.
     * @return {Promise<Array<Items>>} promise resolve with the list io items saved.
     */
    @lockRequest()
    async saveAll(): Promise<Array<Item>>{
        try {
            this._verifySource();
            const items = await this._getSource.bulkSave(this.items as Array<Item>)
            if(items)
                return this.setAll(items);
            else
                throw new Error('Unable to save items');
        } catch (err){
            return Promise.reject(err);
        }
    }

    /**
     * get index of an id in items
     * @param id {uuid} id of the item
     * @return {number} index of the item in items. -1 when not found.
     */
    getIndexById(id?:uuid):number{
        let index = -1;
        if (id){
            index = this.items.findIndex(item => item.id == id)
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
    @lockRequest()
    saveOne(item:Item, reflect:boolean=true):Promise<number>{
        try {
            this.isDefined(item);
            const index = this.getIndexById(item.id);
            let result;
            if (index > -1) {
                this._verifySource();
                result = this._getSource.update(item)
                    .then(item => {
                        //this.items[index] = item;
                        this.splice('items',index, 1,  item);
                        return index;
                    })
            } else {
                result = this._addItem(item, reflect);
            }
            return result;
        } catch (err){
            return Promise.reject(err);
        }
    }

    /**
     * Create a new item in the collection
     * @param item
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {Promise<number>} promise the resolve with the index in items
     */
    @lockRequest()
    add(item:Item, reflect:boolean=true):Promise<number>{
        try {
            this.isDefined(item);
            this._verifySource();
            return this._addItem(item, reflect)
        } catch (err){
            return Promise.reject(err)
        }
    }

    _addItem(item:Item, reflect:boolean=true):Promise<number>{
        return this._getSource.create(item)
            .then(item => {
                if(reflect) {
                    this.push('items', item);
                }
                return this.items.length - 1;
            });
    }
    /**
     * delete all items store in items from ozone.
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {Promise}
     */
    @lockRequest()
    deleteAll(reflect:boolean=true):Promise<void>{
        try {
            this._verifySource();
            const ids = this.items.map(item => item.id);
            return this._getSource.bulkDelete(ids)
                .then((result):any => {
                    if(reflect) {
                        return this.setAll([]);
                    }
                });
        } catch (err){
            return Promise.reject(err);
        }
    }

    /**
     * Delete from ozone a list of item.
     * @param ids {Array<uuid>} list of id to delete from ozone.
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {any}
     */
    @lockRequest()
    async deleteItems(ids:Array<uuid>, reflect:boolean=true): Promise<void>{
        try {
            this.isDefined(ids);
            this._verifySource();
            this._verifySource();
            return this._getSource.bulkDelete(ids)
                .then((ids)=>{
                    if(reflect && ids) {
                        ids.map(id => {
                            this._removeOne(id);
                        });
                    }

                });
        } catch (err){
            return Promise.reject(err);
        }
    }

    /**
     * delete one item from ozone.
     * @param id {uuid} id to delete
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {any}
     */
    @lockRequest()
    deleteOne(id:uuid, reflect:boolean=true): Promise<void>{
        try {
            this.isDefined(id);
            this._verifySource();
            return this._getSource.deleteOne(id)
                .then((id)=>{
                    if(reflect && id) {
                        this._removeOne(id);
                    }
                });
        } catch (err){
            return Promise.reject(err);
        }
    }

    async clear(){
        return this.setAll([])
    }

    private async setAll(newContent: Array<Item>){
        this.set('items', newContent);
        return this.items
    }

    private _removeOne (id:uuid) {
        const index = this.getIndexById(id);
        if (index > -1 ){
            this.splice('items', index, 1);
        }
    }

    private _verifySource() {
        if(!this._source){
            throw new Error('Invalid source')
        }
    }

    @observe('hasMoreData')
    private hasMoreDataChange(value:number){
        this.propertyUpdate('hasMoreData', value)
    }
    @observe('total')
    private totalChange(value:number){
        this.propertyUpdate('total', value)
    }

    private propertyUpdate(name:string, value:any){
        this.dispatchEvent(new CustomEvent<any>(`collection-property-changed` ,{
            bubbles: true,
            composed: true,
            detail: {name, value}
        } as CustomEventInit))
    }
}