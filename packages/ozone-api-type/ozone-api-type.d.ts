import { TypeDescriptor, FieldDescriptor, Grants } from 'ozone-type';
export declare type TypeDescriptorCollection = Map<string, Promise<TypeDescriptor>>;
declare const OzoneApiType_base: OzoneApiAjaxMixinConstructor;
/**
 * `ozone-api-type` is low level polymer module to ozone type.
 * It provide read operation on collection type.
 *
 * By default it create a instance of OzoneApiType in the dom.
 * You can retrieve the default ItemApi with *getOzoneApiType*
 *
 *  * Example in html
 * ```html
 * <ozone-api-type id="ozoneTypeApi" ></ozone-api-type>
 * ```
 *  * Example in javaScript
 * ```javaScript
 * const ozoneTypeAPI = getOzoneApiType(); // return instance of OzoneApiType located in the dom
 * ```
 */
export declare class OzoneApiType extends OzoneApiType_base {
    /**
     * collection type.
     * @value: item
     */
    collection: string;
    /**
     * cached value of types
     */
    typeCached: TypeDescriptorCollection;
    /**
     *
     * @private
     */
    _typeDescriptor: Promise<TypeDescriptor>;
    static readonly properties: {
        collection: {
            type: StringConstructor;
            notify: boolean;
            value: string;
        };
        _typeDescriptor: {
            type: ObjectConstructor;
        };
        typeCached: {
            type: ObjectConstructor;
            value: () => Map<string, Promise<TypeDescriptor>>;
        };
    };
    /**
     * Load api type description form ozone and set typeDescriptor attribute.
     *
     * @return {Promise<TypeDescriptor>}
     */
    loadType(collection?: string): Promise<TypeDescriptor>;
    /**
     *
     * @private
     */
    _getRequest(url: string): Promise<any>;
    _postRequest(url: string, body: any): Promise<any>;
    /**
     * get list of fields of the collection.
     * @return {Promise<Array<FieldDescriptor>>} list of field
     */
    getFields(collection?: string): Promise<Array<FieldDescriptor>>;
    /**
     *
     * @private
     */
    _buildTypeUrl(collection: string): Promise<string>;
    /**
     *
     * @private
     */
    _buildPermissionsUrl(fields: Array<string>): Promise<string>;
    /**
     * will set TypeDescriptor for the given collection in typeCached.
     * @param collection
     * @return {Promise<TypeDescriptorCollection>} promise resolve with collection of typeDescription cached.
     */
    setType(collection: string): Promise<TypeDescriptorCollection>;
    /**
     * retrieve TypeDescriptor of the given collection
     * @param collection
     * @return {TypeDescriptor}
     */
    getType(collection: string): Promise<TypeDescriptor | undefined>;
    /**
     * find FieldDescriptor of a field in a given collection.
     * It will look in parent if needed.
     * @param collection
     * @param field
     * @return {Promise<FieldDescriptor | null>}
     */
    findFieldInCollection(collection: string, field: string): Promise<FieldDescriptor | null>;
    getAllFields(collection: string): Promise<Array<FieldDescriptor>>;
    ifIsTypeInstanceOf(currentType: string, instance: string): Promise<boolean>;
    isFildEditable(): Promise<boolean>;
    getPermissions(fields: Array<FieldDescriptor>, id: uuid): Promise<FieldsPermission>;
}
export declare class FieldsPermission {
    grant: Grants;
    isFieldEditable(fieldName: string): boolean;
    constructor(grant: Grants);
}
/**
 * return OzoneApiType singleton
 * @type {()=>OzoneApiItem}
 */
export declare const getOzoneApiType: () => OzoneApiType;
