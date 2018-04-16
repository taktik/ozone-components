/**
 * Created by hubert on 23/06/17.
 */
import "polymer/polymer-element.html"
import "vaadin-upload/vaadin-upload.html"
import {customElement} from 'taktik-polymer-typescript'
import {UploadFileRequest, XMLHttpRequestLike} from 'ozone-api-upload'
import './ozone-upload.html'

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
    }| undefined;

    ready(){
        super.ready();
        if(this.$)
        this.$.vaadinUpload._createXhr = ()=> {
            return new UploadFileRequest();

        }
    }
    get vaadinUpload(): vaadinUploadType | undefined{
        if(this.$)
        return this.$.vaadinUpload
    }

}{}