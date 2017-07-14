/**
 * Created by hubert on 23/06/17.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("ozone-upload", ["require", "exports", "decorators", "ozone-api-upload"], function (require, exports, taktik_polymer_typeScript_1, ozone_api_upload_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * <ozone-upload> is a template module start an ozone polymer module.
     *
     * ```html
     * <ozone-upload> Document usage with code example </ozone-upload>
     * ```
     */
    let OzoneUpload = class OzoneUpload extends Polymer.Element {
        ready() {
            super.ready();
            this.$.vaadinUpload._createXhr = () => {
                return new ozone_api_upload_1.UploadFileRequest();
            };
        }
    };
    OzoneUpload = __decorate([
        taktik_polymer_typeScript_1.customElement('ozone-upload')
    ], OzoneUpload);
    exports.OzoneUpload = OzoneUpload;
    { }
});
