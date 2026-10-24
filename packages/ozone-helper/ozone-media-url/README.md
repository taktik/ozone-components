[![NPM version][npm-image]][npm-url]
# ozone-media-url

Helper to convert ozone id to media preview

 ## install

 ```
 $ npm install --save ozone-media-url
 ```

## OzoneMediaUrl

````typeScript
                import { OzoneMediaUrl, OzonePreviewSize, SizeEnum } from 'ozone-media-url'

                const size = OzonePreviewSize.Small
				const ozoneMediaUrl = new OzoneMediaUrl(data.id, getDefaultClient().config.ozoneURL)
				this.set('previewImage', ozoneMediaUrl.getPreviewUrlPng(size))
````


## Downloading medias

````typeScript
                import { OzoneMediaUrl } from 'ozone-media-url'

				// Posts the selection as a form into a hidden frame: a url could not list a large one
				OzoneMediaUrl.downloadMedias(ids, getDefaultClient().config.ozoneURL)
````

## Since 7.0.0

The urls carry the media UUID instead of the integer of the legacy ids, which a media created with a random UUID
does not have: `/view` needs an Ozone accepting UUIDs (3.3, ee2c1650c1), and `downloadMedias` one accepting a posted
selection on `/media` (3.3, 89da8c24e6). `convertToNumericID` and `getNumericId` are gone, and
`getMediaUploadUrl`, which returned a download url through the v2 API, gave way to `downloadMedias`.

## OzoneVideoUrl

````typeScript
                import { OzoneVideoUrl} from 'ozone-media-url'

				const ozoneVideoUrl = new OzoneVideoUrl(video, getDefaultClient())
				this.set('videoUrl', await ozoneVideoUrl.getPreferredVideoFormat())
````

[npm-image]: https://badge.fury.io/js/ozone-media-url.svg
[npm-url]: https://npmjs.org/package/ozone-media-url
