import { Item } from 'ozone-type';
import { SearchGenerator, SearchQuery } from 'ozone-search-helper';
export interface BulkResponse {
    response: Array<Item>;
}
export interface ItemResponse {
    response: Item;
}
declare const OzoneApiItem_base: OzoneApiAjaxMixinConstructor;
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
export declare class OzoneApiItem extends OzoneApiItem_base {
    $: {
        ozoneAccess: IronAjax;
    };
    /**
     * type of the ozone collection.
     * Default value is 'item'
     */
    collection: string;
    static readonly properties: {
        collection: {
            type: StringConstructor;
            notify: boolean;
            value: string;
        };
    };
    static readonly observers: string[];
    /**
     * observer on collection
     * @private
     */
    private _collectionChange(collection, endpoints);
    /**
     * Create or update a collection item.
     * @param data Item item to create.
     * @return {Promise<Item>}
     */
    create(data: Item): Promise<Item>;
    /**
     * Create or update a collection item.
     * @param data Item item to update.
     * @return {Promise<Item>}
     */
    update(data: Item): Promise<Item>;
    /**
     * get one collection item by uuid.
     * @param id
     * @return {Promise<Item | null>}
     */
    getOne(id: uuid): Promise<Item | null>;
    /**
     * delete one collection item by uuid.
     * @param id
     * @return {Promise<any>}
     */
    deleteOne(id: uuid): Promise<uuid>;
    /**
     * get collection items from a list of id.
     * @param ids {Array<uuid>} array of id to get
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    bulkGet(ids: Array<uuid>): Promise<Array<Item>>;
    /**
     * delete items from a list of id.
     * @param ids
     * @return {Promise<Array<uuid>>} promise resole with an array of deleted id
     */
    bulkDelete(ids: Array<uuid | undefined>): Promise<Array<uuid>>;
    /**
     * save an array of items
     * @param items
     * @return {Promise<Iterator<Item>>} promise resole with an iterator of collection item
     */
    bulkSave(items: Array<Item>): Promise<Array<Item>>;
    /**
     * Submit ozone search query
     */
    search(search: SearchQuery): SearchGenerator;
    private _readItemResponse;
    private _readBulkItemResponse;
    private _postRequest(url, body, responseFilter);
    private _getRequest(url);
    private _deleteRequest(url);
    private _buildUrl(action);
}
/**
 * return OzoneApiItem singleton
 * @type {()=>OzoneApiItem}
 */
export declare const getOzoneApiItem: () => OzoneApiItem;
