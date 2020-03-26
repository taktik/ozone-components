import "polymer/polymer.html"
import "polymer/polymer-element.html"
import "marked-element/marked-element.html"
import "iron-pages/iron-pages.html"
import "paper-tabs/paper-tabs.html"
import "paper-tabs/paper-tab.html"
import "../demo-header/demo-header.html"
import "ozone-free-text-search"
import "ozone-login"
import "ozone-mosaic"
import "ozone-upload"
import "ozone-item-preview"
import "../ozone-edit-panel"
import "../video-edit-panel"
import 'ozone-media-edit'
//import 'ozone-item-edit/src/ozone-item-edit.ts'
import './ozone-components-demo.html'
import {OzoneApiItem} from 'ozone-api-item';
import { getDefaultClient } from 'ozone-default-client'

import {SearchQuery} from "ozone-search-helper";
import { OzoneClient } from 'ozone-typescript-client'
/**
 * @customElement
 * @polymer
 */
class OzoneComponentsDemo extends Polymer.Element {
    static get is() { return 'ozone-components-demo'; }
    static get properties() {
        return {
            search: {
                type: String,
                value: '',
                observer: '_searchChange'
            },
            type: {
                type: String,
                value: 'item'
            },
            result: {
                type: Array
            },
            autoCompleteResult: {
                type: Array
            },
            numberOfResults: {
                type: Number
            },
            selectedPage: {
                type: Number
            },
            isConnected: {
                type: Boolean,
                observer: "_isConnectedChange"
            }
        };
    }

    constructor(){
        super();
        this._source = new OzoneApiItem();
    }

    ready() {
        super.ready();
        this.$.editPanel.addEventListener('save-tap', (event) => {
            this.$.ozoneMosaic.saveSelectedItem(event.detail)
                .then((item) => {
                    this.$.editPanel.set('selectedItem', item)
                });
        });
        this.$.ozoneMosaic.addEventListener("delete-item", (event) =>{
            this.$.ozoneMosaic.$.ironList.$.mosaicCollection.deleteOne(event.detail.id, true)
        });
        this.$.editPanel.addEventListener('close-tap', (event) => {
            this.$.editPanel.set('display', false);
        });
        this.$.videoEditPanel.addEventListener('close-tap', (event) => {
            this.$.videoEditPanel.set('display', false);
        });
        this.$.ozoneMosaic.addEventListener('edit-item', (event) => {
            this.$.editPanel.set('display', true);
            this.$.editPanel.set('selectedItem', event.detail);
        });

        this.$.ozoneMosaic.addEventListener('info-item', (event) => {
            this.$.videoEditPanel.set('display', true);
            this.$.videoEditPanel.set('selectedItem', event.detail);
        });

        this.$.ozoneUpload.addEventListener('ozone-upload-completed', (event)=>{
            this.$.ozoneMosaic.$.ironList.$.mosaicCollection.findOne(event.detail.mediaId)
        })

        this.$.freeTextSearch.addEventListener("taktik-search", () => this._searchSubmit());

		this.$.sendFile.addEventListener("click", async () => {
			try {
				let file = this.$.selectedFile.files[0];
				this._saveFile(file)
			} catch (e) {
				console.error(e)
			}
		})
		fetch('../version_history.txt')
			.then(r => r.text())
			.then(r => r.split('\n'))
			.then(versions => {
				this.set('versions', versions.map(version => (
					{
						version,
						link: `../${version}/index.html`
					}
				)))
			})
    }

    async _saveFile(fileData) {
		const blobClient = getDefaultClient().blobClient()
		const blobString = await blobClient.create(fileData)
		const blobCreated = await blobClient.getById(blobString.id)
		const url = await blobClient.getDownloadableUrl(blobCreated.id, 'data.txt')
		this.$.blobLink.href=url
		console.log(url)
	}

    _isConnectedChange(value) {
        if(this.isConnected){
        }

    }

    _searchSubmit (){
        const searchQuery = new SearchQuery()
        searchQuery
            .quicksearch(this.search)
            .setSize(5)
           // .order('creationDate').ASC;

        this.$.ozoneMosaic.search(searchQuery);

    }
    async _searchChange(searchString){

        searchString = searchString ? searchString : ''; // replace undefined by empty string
        let allTerms = searchString.split(' ');
        let lastTerm = allTerms[allTerms.length-1];

        const searchQuery = new SearchQuery()
        searchQuery
            .quicksearch(this.search)
            .setSize(5)
            .suggestion(searchString, lastTerm, 5);

        const _searchIterator = await this._source.on(this.type).search(searchQuery);
        const response =  await _searchIterator.next()
        if(response.aggregations && response.aggregations.length > 0 && response.aggregations[0].buckets) {
            const results = response.aggregations[0].buckets
            this.set('autoCompleteResult', results)
        }

    }

}

window.customElements.define(OzoneComponentsDemo.is, OzoneComponentsDemo);
