<h1 align="center">Work in progress...</h1>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Amstramgram75/Amstramgram-Media-Player)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](https://github.com/Amstramgram75/Amstramgram-Video-Player/blob/master/LICENSE)
![No dependency](https://img.shields.io/badge/dependencies-none-green)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/Amstramgram75)

Simple, elegant, lightweight although powerful and versatile HTML5 media player.

[Docs and demo](https://amstramgram75.github.io/Amstramgram-Media-Player/)

## Table of contents
* [Features](#features)
* [Installation](#installation)
* [Importing](#importing)
* [Usage](#usage)
* [Compatibility](#compatibility)
* [Thanks](#thanks)
* [Donation](#donation)
* [Credits](#credits)
* [License](#license)

## Features

* Written in pure JavaScript, no dependencies required
* Touch-devices support
* Three UI modes : normal / compact / mini
* Preview thumbnails support
* SVG buttons included in css, no extra files to download
* Previous, play/pause, next, fullscreen, subtitles, pip, settings, download buttons
* All buttons titles configurable
* Display of current time and total duration
* __Sass__ so you can include in your build processes
* Around 25.44 Ko gzipped (js + css) and even 19.39 Ko if you only need the audio player...

__BUT no Youtube, Vimeo or whatever integration.__
___

## Installation

You can use one of the following methods :

#### npm
```sh
npm -i -d amstramgrammediaplayer
```
#### Manually
1. Download the `dist` folder.
2. Somewhere in your document :
```html
<link rel="stylesheet" href="dist/css/amstramgramMediaPlayer.min.css">
<script src="dist/iife/amstramgramMediaPlayer.min.js"></script>
```Or if you like to take advantage of the support for javascript modules in all major browsers (and you should !), you can do :
```html
<link rel="stylesheet" href="dist/css/amstramgramMediaPlayer.min.css">
<script type="module">
   import AmstramgramMediaPlayer from './dist/esm/amstramgramMediaPlayer.min.js'
   window.AmstramgramMediaPlayer = AmstramgramMediaPlayer
</script>
<script nomodule src="dist/iife/amstramgramMediaPlayer.min.js"></script>
```
___
## Importing
#### Traditional approach

If you include the file with a `<script>` tag, you don't have to import anything explicitly. `AmstramgramMediaPlayer` will be available in the global scope.

#### CommonJS

```js
const AmstramgramMediaPlayer = require('AmstramgramMediaPlayer');
```

#### ES2015 modules

```js
import AmstramgramMediaPlayer from 'AmstramgramMediaPlayer';
```

#### Sass

```scss
@use "../node_modules/amstramgrammediaplayer/src/scss/amstramgramAudioPlayer";
```
___
## Usage

Initialize the script by running :

```js
new AmstramgramMediaPlayer(document.querySelector('video'))
```
___
## Customization

Before you create an instance, you can override the class default options :
```js
AmstramgramMediaPlayer.options({
  // Custom options
});
```
See here for details...

When creating an instance, you can pass an object with custom options as the second parameter.

```js
new AmstramgramMediaPlayer(document.querySelector('video'),{
  // Custom options
});
```
When setting the source, you can pass a simple string giving the video file path or an object including the source path and several other options as duration, poster, thumbnails and so on...
```js
const player = new AmstramgramMediaPlayer(document.querySelector('video'));
player.src = {
  src: 'video file path',
  duration: 'duration of the video',
  poster: 'poster path',
  thumbnails: 'thumbnails path',
  ...
}
```
___
## Compatibility
All modern browsers on desktop, Android and iOS are supported.  
__Internet Explorer 11__ needs some polyfills (what a surprise !)
___
## Thanks
<a href="https://www.browserstack.com/" target="_blanck">
  <img src="https://live.browserstack.com/images/opensource/browserstack-logo.svg" width="192px" height="42px">
</a>

Thanks to <a href="https://www.browserstack.com/" target="_blanck">BrowserStack</a> for providing the infrastructure that allows me to test in real browsers !
___
## Donation
If you find this project useful and want to say thanks, you can buy me a cup of coffee, a beer, a computer, a sofa, a haunted manor or whatever you want...  
...:blush:...

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)]((https://paypal.me/Amstramgram75))
___
## Credits
I've been mainly inspired by [mediaelement.js](https://www.mediaelementjs.com/), a pioneer in the long and difficult attempt to harmonize media players in `HTML5`.  
Alternatively, I've also used [plyr.js](https://plyr.io/).
___
## License
Copyright (c) 2019 [Amstramgram](https://github.com/Amstramgram75)  
This content is released under the MIT License.