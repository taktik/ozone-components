import { LocalizedString } from "ozone-type";
import './ozone-localized-string.html';
/**
 * <localize-name> is an element to display an ozone localize-name.
 *
 * ```html
 * <localize-name language=en  data="[[localizeName]]"></localize-name>
 * ```
 */
export declare class LocalizedStringDisplay extends Polymer.Element {
    /**
     * data to display
     */
    data: LocalizedString;
    /**
     * language key used to display the name
     */
    language: string;
    /**
     * language default key to use is the selected language is not available.
     */
    defaultLanguage: string;
    /**
     * displayed string
     * @notify
     */
    displayString: string;
    static readonly properties: {
        data: {
            type: ObjectConstructor;
        };
        language: {
            type: StringConstructor;
        };
        defaultLanguage: {
            type: StringConstructor;
        };
        displayString: {
            type: StringConstructor;
            notify: boolean;
        };
    };
    static readonly observers: string[];
    /**
     *
     * @private
     */
    _changes(data: LocalizedString, language: string): void;
}
