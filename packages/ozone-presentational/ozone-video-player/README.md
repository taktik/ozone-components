[![Build Status](https://travis-ci.org/taktik/ozone-video-player.svg?branch=master)](https://travis-ci.org/taktik/ozone-video-player)

# \<ozone-video-player\>

Customisable Ozone video player. Package in a webComponents and written in typeScript

# usage

## Install

Install form github

npm install  ozone-video-player --save

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

*Compete documentation ca be generated with `npm run doc`*

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


# Contribution guide

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Install Dependency

```
$ npm install
$ bower install
```

## Build your package

```
$ npm run start
```
Or watch demo on change
```
$ npm run demo
```
