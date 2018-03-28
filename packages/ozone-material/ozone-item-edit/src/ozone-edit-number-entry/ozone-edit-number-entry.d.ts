import { OzoneEditEntryConstructor } from 'ozone-edit-entry';
import "paper-input/paper-input.html";
import "ozone-edit-entry";
import "./ozone-edit-number-entry.html";
declare const OzoneEditNumberEntry_base: OzoneEditEntryConstructor;
/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as number.
 *
 */
export declare class OzoneEditNumberEntry extends OzoneEditNumberEntry_base {
    textValue: string;
    static readonly properties: {
        textValue: {
            type: StringConstructor;
        };
    };
    static readonly observers: string[];
    registerChangeListener(): void;
    textToNumber(textValue: string): Number | null;
    isValueAndTextEqual(): boolean;
    valueChange(): void;
    textChange(): void;
}
