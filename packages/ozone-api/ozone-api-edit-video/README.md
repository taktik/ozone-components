
# ozone-api-edit-video

ES6 module written in typeScript to save selected video chunks.


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