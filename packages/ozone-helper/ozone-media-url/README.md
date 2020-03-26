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


## OzoneVideoUrl

````typeScript
                import { OzoneVideoUrl} from 'ozone-media-url'

				const ozoneVideoUrl = new OzoneVideoUrl(video, getDefaultClient())
				this.set('videoUrl', await ozoneVideoUrl.getPreferredVideoFormat())
````

[npm-image]: https://badge.fury.io/js/ozone-media-url.svg
[npm-url]: https://npmjs.org/package/ozone-media-url
