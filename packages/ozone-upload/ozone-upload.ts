/**
 * Created by hubert on 23/06/17.
 */


/// <amd-module name="ozone-upload"/>

import {customElement} from 'taktik-polymer-typeScript'
import {UploadFileRequest, XMLHttpRequestLike} from 'ozone-api-upload'


export interface vaadinUploadType extends PolymerElement{
    _createXhr:{ ():XMLHttpRequestLike }
}


/**
 * <ozone-upload> is a template module start an ozone polymer module.
 *
 * ```html
 * <ozone-upload> Document usage with code example </ozone-upload>
 * ```
 */
@customElement('ozone-upload')
export class OzoneUpload extends Polymer.Element {

    $: {
        vaadinUpload: vaadinUploadType
    };

    ready(){
        super.ready();

        this.$.vaadinUpload._createXhr = ()=> {
            return new UploadFileRequest();

        }
    }

}{}