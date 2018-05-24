[![NPM version][npm-image]][npm-url]
# ozone-api-edit-video

ES6 module written in typeScript to save selected video chunks.

# install

```
npm install ozone-api-edit-video
```

# Usage

```javaScript
import {OzoneApiEditVideo} from 'ozone-api-edit-video'
const ozoneApiEditVideo =  new OzoneApiEditVideo();

// TODO get originalVideo from ozone-api-item
// TODO get selectedChunks from ozone-video-player

ozoneApiEditVideo
.createSubVideo(originalVideo, selectedChunks)
.then((video) => {
   console.log('new video created with id', video.id)
});
```


[npm-image]: https://badge.fury.io/js/ozone-api-edit-video.svg
[npm-url]: https://npmjs.org/package/ozone-api-edit-video