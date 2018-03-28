import {customElement, property} from 'taktik-polymer-typescript'
import {LocalizedString} from "ozone-type";

import './ozone-localized-string.html'

/**
 * <localize-name> is an element to display an ozone localize-name.
 *
 * ```html
 * <localize-name language=en  data="[[localizeName]]"></localize-name>
 * ```
 */
@customElement('ozone-localized-string')
export class LocalizedStringDisplay extends Polymer.Element{

    /**
     * data to display
     */
    @property({type: Object})
    data: LocalizedString = {};

    /**
     * language key used to display the name
     */
    @property({type: String})
    language?: string;

    /**
     * language default key to use is the selected language is not available.
     */
    @property({type: String})
    defaultLanguage?: string = 'en';

    /**
     * displayed string
     * @notify
     */
    @property({type: String, notify: true})
    displayString?: string;

    static get observers() {
        return ['_changes(data, language)'];
    }

    /**
     *
     * @private
     */
    _changes(data: LocalizedString, language: string) {
        if(data && data.strings) {
            if(data.strings.hasOwnProperty(language)) {
                this.set('displayString', data.strings[language])
            } else {
                if(! this.defaultLanguage){
                  throw new Error('No languages define')
                }
                this.set('displayString', data.strings[this.defaultLanguage])
            }
        }
    }

}

