import { Item } from 'ozone-type';
import { OzoneApiItem } from 'ozone-api-item';
import { SearchQuery } from 'ozone-search-helper';
export declare type uuid = string;
/**
 * <ozone-collection> is a generic component to manage collection of item.
 */
export declare class OzoneCollection extends Polymer.Element {
    $: {
        ozoneApi: OzoneApiItem;
        scrollTheshold: {
            clearTriggers(): void;
        };
    };
    /**
     * id of the OzoneApiItem element to be use as source
     * By default it use default ozone-api-item
     */
    sourceId: string;
    /**
     * Array of items loaded from the source
     * @notify: true
     */
    items: Array<Item>;
    /**
     * total number of results found in ozone
     * @notify: true
     */
    total: Number;
    /**
     * true if there is still data to be loaded in the collection.
     * @notify: true
     */
    dataRemain: Boolean;
    private _source;
    private readonly _getSource;
    private _searchIterator;
    static readonly properties: {
        sourceId: {
            type: StringConstructor;
            observer: string;
        };
        items: {
            type: ArrayConstructor;
            notify: boolean;
            value: () => never[];
        };
        _searchIterator: {
            type: ObjectConstructor;
        };
        total: {
            type: NumberConstructor;
            notify: boolean;
        };
        dataRemain: {
            type: BooleanConstructor;
            notify: boolean;
            value: boolean;
        };
    };
    ready(): void;
    private _updateSource(sourceId);
    /**
     * load first collection items
     * items are added to the items array.
     * @param size {number} number of items to load default value is 10
     */
    loadItems(size: number): void;
    /**
     * quick search for items in the collection.
     * @param searchString
     * @param size {number} number of items to load default value is 10
     */
    quickSearch(searchString: string, size?: number): void;
    /**
     * Start a complex search on the collection
     * found items are added to the items array.
     * @param searchQuery {SearchQuery} search query
     */
    search(searchQuery: SearchQuery): void;
    /**
     * query next search result from ozone.
     * found items are added to the items array.
     * @return {Promise}
     */
    loadNextItems(): Promise<void>;
    /**
     * find one item in ozone collection.
     * The item found is added in the items array.
     * @param id {uuid} id of the item to get.
     * @return {Promise<Item>} promise resolve with the item or null (if not found).
     */
    findOne(id: uuid): Promise<Item | null>;
    private isDefined(param);
    /**
     * save all items present in items on ozone.
     * items are updated with the result of the save.
     * @return {Promise<Array<Items>>} promise resolve with the list io items saved.
     */
    saveAll(): Promise<any>;
    /**
     * get index of an id in items
     * @param id {uuid} id of the item
     * @return {number} index of the item in items. -1 when not found.
     */
    getIndexById(id?: uuid): number;
    /**
     * save one item in ozone.
     * result is reflect in items.
     * @param {Item} item to save.
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {Promise<number>} Promise resolve with index of the item in items.
     */
    saveOne(item: Item, reflect?: boolean): Promise<number>;
    /**
     * Create a new item in the collection
     * @param item
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {Promise<number>} promise the resolve with the index in items
     */
    add(item: Item, reflect?: boolean): Promise<number>;
    /**
     * delete all items store in items from ozone.
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {Promise}
     */
    deleteAll(reflect?: boolean): Promise<any>;
    /**
     * Delete from ozone a list of item.
     * @param ids {Array<uuid>} list of id to delete from ozone.
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {any}
     */
    deleteItems(ids: Array<uuid>, reflect?: boolean): Promise<void>;
    /**
     * delete one item from ozone.
     * @param id {uuid} id to delete
     * @param reflect {boolean} reflect change from ozone in items list
     * @return {any}
     */
    deleteOne(id: uuid, reflect?: boolean): Promise<void>;
    private _removeOne(id);
    private _verifySource();
}
