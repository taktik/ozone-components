/**
 * Created by hubert on 23/06/17.
 */
import "polymer/polymer.html";
import "vaadin-upload/vaadin-upload.html";
import { XMLHttpRequestLike } from 'ozone-api-upload';
import './ozone-upload.html';
export interface vaadinUploadType extends PolymerElement {
    _createXhr: {
        (): XMLHttpRequestLike;
    };
}
/**
 * <ozone-upload> is a template module start an ozone polymer module.
 *
 * ```html
 * <ozone-upload> Document usage with code example </ozone-upload>
 * ```
 */
export declare class OzoneUpload extends Polymer.Element {
    $: {
        vaadinUpload: vaadinUploadType;
    } | undefined;
    ready(): void;
    readonly vaadinUpload: vaadinUploadType | undefined;
}
