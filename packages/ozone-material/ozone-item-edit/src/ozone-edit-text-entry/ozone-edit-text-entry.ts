/**
 * Created by hubert on 23/06/17.
 */

import "paper-input/paper-textarea.html"
import "./ozone-edit-text-entry.html"
import {customElement} from 'taktik-polymer-typescript'
import {OzoneEditEntry} from '../ozone-edit-entry/ozone-edit-entry'

/**
 * <ozone-edit-number-entry> is an element to edit ozone items fields as multi line text.
 *
 */
@customElement('ozone-edit-text-entry')
export class OzoneEditTextEntry extends OzoneEditEntry{

}