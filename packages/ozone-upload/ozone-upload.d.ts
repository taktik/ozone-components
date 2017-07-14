import { XMLHttpRequestLike } from 'ozone-api-upload';
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
    };
    ready(): void;
}
