[![NPM version][npm-image]][npm-url]

# ozone-video-player

Customisable Ozone video player. Package in a webComponents and written in typeScript.
Features:
*  Play video from an url
*  Play ozone Video item
*  Control video (OSD) play/pause, sound, full screen 
*  Display control for ozone subtitles
*  Add and controls markers on the video (used for video montage)

# usage

## Install

```
npm install  ozone-video-player --save
```

Add conf.ozone.json at root of your project. You can adapt conf.ozone.json from this repo.

## use pre bundle version

To include bundle ozone-video-player element in your javaScript:

```html
<script type="text/javascript" src="node_modules/ozone-video-player/build/index.js"></script>

<ozone-video-player></ozone-video-player>
```


See example in demo/Example_Bundle

## Build with webpack

```javaScript
import {OzoneVideoPlayer} from "ozone-video-player";

// Your code here

```

See example in demo/Example_Import

For usage in typeScript use option `"moduleResolution": "node"`

## API

Most important parameters.

### Attribute
Attribute are javaScript properties accessible from the dom.

* hidden

> hidden: Default is false. True when set.
> hide element and pause the player.

* video-url (alias videoUrl)

> videoUrl: string
> Url to play a video directly

* video

> video: Video
> OzoneVideo to play.

* markers
>    markers: Array<MarkerOnVideo> 
>    Array of markers on video

* subtitlesAvailable
> subtitlesAvailable: Array<string>
> List of subtitles languages available

* subtitleSelected
> subtitleSelected: string
> selected subtitle language



### Properties

Only accesible for JavaScript

* player

> player: ClapprPlayer
> Interface to Clappr player element


### Methode

* loadOzoneVideo

> loadOzoneVideo(data?: Video): Promise<void>
> Load video from Ozone.
> Parameters is an Ozone Video Object

* loadVideoUrl
> loadVideoUrl(url: string): Promise<void>
> Load a video from an url.


### Styling
 
The following custom css mixin properties are available for styling:
 
Custom property | Description | Default
----------------|-------------|----------
`--marker-bar-background` | Background color of the marker's bar | `rgba(29,38,43,0.52)`
`--resizer-color` | Background color of the resizer | `rgba(29,38,43,0.9)`
`--resizer-handle-color` | Background color of the resizer's handle | `rgba(255,255,255,0.2)`
`--marker-bar` | Mixin applied to the marker's bar| {}
`--resizer` | Mixin applied to the marker's bar| {}
`--moving-tooltip-background-color` | Background color of the moving tooltip | `rgba(29,38,43,0.9)`
`--moving-tooltip-text-color` | Text color of the moving tooltip | `white`
`--moving-tooltip-mixin` | Mixin applied to the marker's bar| {}
`--subtiltes-color` | Color of the subtitles | `#fffb00`
`--subtitles-font-size` | Font size of the subtiltes | `16px`
`--subtitles-weight` | Font weight of the subtitles | `bold`
`--subtitles-font-family` | Font family of the subtitles | `'Roboto'`
`--subtitles` | Mixin applied to the subtitles and the subtitles' container | {}

# Contribution guide

## Build your package

```
$ npm run start
```
Or watch demo on change
```
$ npm run demo
```

[npm-image]: https://badge.fury.io/js/ozone-video-player.svg
[npm-url]: https://npmjs.org/package/ozone-video-player
