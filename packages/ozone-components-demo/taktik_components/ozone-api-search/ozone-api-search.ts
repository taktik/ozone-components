/**
 * `ozone-api-search` is a module for Ozone content suggestion.
 *
 * Example:
 *
 * ```html
 * <ozone-api-search></ozone-api-search>
 * ```
 *
 */
declare class OzoneApiSearch extends Polymer.Element{

    /**
     * If true, it will suggest result for a *suggest* function.
     *
     * In suggest mode, *searchResults* is an array of aggregations object (key, docCount).
     * Otherwise it is a list of search items
     */
    suggest:string;

    /**
     * Type of items search.
     * Default value search in all types
     */
    itemType:string;

    /**
     * Max size of searchResults list.
     */
    size:number;

    /**
     * Submit ozone search query
     */
    requestSearch ():void;


}