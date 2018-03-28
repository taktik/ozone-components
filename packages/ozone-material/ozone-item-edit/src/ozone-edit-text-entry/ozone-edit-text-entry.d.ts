/**
 * Created by hubert on 23/06/17.
 */
import "paper-input/paper-textarea.html";
import "./ozone-edit-text-entry.html";
import 'ozone-edit-entry';
import { OzoneEditEntryConstructor } from 'ozone-edit-entry';
declare const OzoneEditTextEntry_base: OzoneEditEntryConstructor;
/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as multi line text.
 *
 */
export declare class OzoneEditTextEntry extends OzoneEditTextEntry_base {
    $: {
        input: PolymerElement;
    };
}
