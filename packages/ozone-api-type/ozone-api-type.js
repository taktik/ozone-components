/// <amd-module name="ozone-api-type"/>
/**
 * Created by hubert on 19/06/17.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("ozone-api-type", ["require", "exports", "taktik-polymer-typeScript"], function (require, exports, taktik_polymer_typeScript_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    let OzoneApiType = class OzoneApiType extends OzoneApiAjaxMixin(Polymer.Element) {
        static get properties() {
            return {
                collection: {
                    type: String,
                    notify: false,
                    value: 'item'
                },
                _typeDescriptor: {
                    type: Object
                },
                typeCached: {
                    type: Object,
                    value: () => { return new Map(); }
                }
            };
        }
        /**
         * Load api type description form ozone and set typeDescriptor attribute.
         *
         * @return {Promise<TypeDescriptor>}
         */
        loadType(collection) {
            collection = collection || this.collection;
            this._typeDescriptor = this._buildTypeUrl(collection)
                .then((url) => {
                return this._getRequest(url);
            }).then((response) => {
                return response;
            });
            return this._typeDescriptor;
        }
        /**
         *
         * @private
         */
        _getRequest(url) {
            this.$.ozoneAccess.url = url;
            this.$.ozoneAccess.method = 'GET';
            return this.$.ozoneAccess
                .generateRequest().completes.then((res) => res.response);
        }
        _postRequest(url, body) {
            this.$.ozoneAccess.url = url;
            this.$.ozoneAccess.method = 'POST';
            this.$.ozoneAccess.body = JSON.stringify(body);
            return this.$.ozoneAccess
                .generateRequest().completes.then((res) => res.response);
        }
        /**
         * get list of fields of the collection.
         * @return {Promise<Array<FieldDescriptor>>} list of field
         */
        getFields(collection) {
            collection = collection || this.collection;
            return this._typeDescriptor.then((type) => {
                if (type.fields) {
                    return type.fields;
                }
                else
                    return [];
            });
        }
        /**
         *
         * @private
         */
        _buildTypeUrl(collection) {
            return getOzoneConfig().configPromise.then((config) => {
                return `${config.host}${config.type}`
                    .replace(/\{type\}/, collection);
            });
        }
        /**
         *
         * @private
         */
        _buildPermissionsUrl(fields) {
            return getOzoneConfig().configPromise.then((config) => {
                return `${config.host}${config.permissions}?fields=${fields.join(',')}`;
            });
        }
        /**
         * will set TypeDescriptor for the given collection in typeCached.
         * @param collection
         * @return {Promise<TypeDescriptorCollection>} promise resolve with collection of typeDescription cached.
         */
        setType(collection) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.typeCached.has(collection)) {
                    return this.typeCached;
                }
                else {
                    return this.typeCached.set(collection, this.loadType(collection));
                }
            });
        }
        /**
         * retrieve TypeDescriptor of the given collection
         * @param collection
         * @return {TypeDescriptor}
         */
        getType(collection) {
            return __awaiter(this, void 0, void 0, function* () {
                const cache = yield (this.setType(collection));
                return cache.get(collection);
            });
        }
        /**
         * find FieldDescriptor of a field in a given collection.
         * It will look in parent if needed.
         * @param collection
         * @param field
         * @return {Promise<FieldDescriptor | null>}
         */
        findFieldInCollection(collection, field) {
            return this.getType(collection)
                .then(typeDescriptor => {
                if (typeDescriptor && typeDescriptor.fields) {
                    const index = typeDescriptor.fields.findIndex(f => f.identifier == field);
                    if (index > -1) {
                        return typeDescriptor.fields[index];
                    }
                    else if (typeDescriptor.superType) {
                        // look in parent if exist
                        return this.findFieldInCollection(typeDescriptor.superType, field);
                    }
                }
                return null;
            });
        }
        getAllFields(collection) {
            return __awaiter(this, void 0, void 0, function* () {
                const type = yield (this.getType(collection));
                if (type && type.superType) {
                    const fields = type.fields || [];
                    let parentFields = [];
                    parentFields = yield (this.getAllFields(type.superType));
                    return fields.concat(parentFields);
                }
                return [];
            });
        }
        ifIsTypeInstanceOf(currentType, instance) {
            return __awaiter(this, void 0, void 0, function* () {
                if (currentType == instance) {
                    return true;
                }
                else {
                    const typeDescriptor = yield (this.getType(currentType));
                    if (typeDescriptor && typeDescriptor.superType) {
                        // look in parent if exist
                        return yield (this.ifIsTypeInstanceOf(typeDescriptor.superType, instance));
                    }
                    else {
                        return false;
                    }
                }
            });
        }
        isFildEditable() {
            return __awaiter(this, void 0, void 0, function* () {
                return false;
            });
        }
        getPermissions(fields, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const Ids = [id];
                const fildsId = fields.map(field => field.identifier);
                const url = yield (this._buildPermissionsUrl(fildsId));
                const grants = yield (this._postRequest(url, Ids));
                return new FieldsPermission(grants[0]);
            });
        }
    };
    OzoneApiType = __decorate([
        taktik_polymer_typeScript_1.customElement('ozone-api-type')
    ], OzoneApiType);
    exports.OzoneApiType = OzoneApiType;
    class FieldsPermission {
        isFieldEditable(fieldName) {
            if (this.grant.fieldGrants && this.grant.fieldGrants.hasOwnProperty(fieldName)) {
                return typeof (this.grant.fieldGrants[fieldName]
                    .find(i => i == 'FIELD_EDIT')) == 'string';
            }
            else {
                return false;
            }
        }
        constructor(grant) {
            this.grant = grant;
        }
    }
    exports.FieldsPermission = FieldsPermission;
    function OzoneApiTypeGenerator() {
        let ozoneTypeAPI;
        return () => {
            if (!document.querySelector('#ozoneTypeAPI')) {
                ozoneTypeAPI = document.createElement('ozone-api-type');
                ozoneTypeAPI.id = 'ozoneTypeAPI';
                document.body.appendChild(ozoneTypeAPI);
            }
            return (document.querySelector('#ozoneTypeAPI'));
        };
    }
    /**
     * return OzoneApiType singleton
     * @type {()=>OzoneApiItem}
     */
    exports.getOzoneApiType = OzoneApiTypeGenerator();
});
