//cSpell:words amstramgram oups
import { clone } from "../tools/utils.js";
import AudioDefaultOptions from './audioDefaultOptions.js'

const
  instanceOptions = {
    ...AudioDefaultOptions.instance,
    appLabel: 'Video player',
    touchSeekingInfoText: 'Tap & go !',
  },
  srcOptions = {
    ...AudioDefaultOptions.src,
    format: 16 / 9,
    fullscreen: { label: { on: 'Exit fullscreen', off: 'Fullscreen' }, disabled: false, hidden: false, tooltip: { hidden: false, left: true } },
    playsInline: true,
    poster: '',
    thumbnails: { src: undefined, width: 120, int: 0 },
  }
  if ('pictureInPictureEnabled' in document) {
    srcOptions.pip = { label: { on: 'Disable PIP', off: 'PIP' }, disabled: false, hidden: false, tooltip: { hidden: false, left: true } }
  }

/**
 * @class VideoDefaultOptions
 * @description Defines the default options of the AmstramgramVideoPlayer
 */
export default class VideoDefaultOptions {
  /**
   * @getter instance
   * @returns {Object}
   * @description returns the default options for an AmstramgramVideoPlayer instance
   *  
      appLabel: 'Video Player',
      alwaysShowHours: false,
      compactMaxWidth: 600,
      errorMessage: "Oups ! Media can't be found !!!",
      hideControlsDelay: 5000,//Only used for vertical volume slider on not mobile devices whose pointer is not mouse
      miniMaxWidth: 500,
      touchSeekingInfoText: 'Tap & go !',
      type: 'video',
      volumeBeforeMute: 0.8,
      volumeGroup: 0,
      volumeHelpLabel: 'Use Up/Down arrow keys to increase/decrease the volume',
      volumeOrientation: 'vertical',
      volumeSliderLabel: 'Volume slider'
   */
  static get instance() {
    return { ...instanceOptions }
  }

  /**
   * @getter src
   * @returns {Object}
   * @description returns the default options for an AmstramgramVideoPlayer src
   *       
      autoplay: false,
      crossOrigin: 'anonymous',
      download: { label: 'Download', disabled: false, hidden: false, tooltip: { hidden: false, position: 'left' } },
      duration: 120,
      format: 16 / 9,
      fullscreen: { label: { on: 'Exit fullscreen', off: 'Fullscreen' }, disabled: false, hidden: false, tooltip: { hidden: false, position: 'left' } },
      loop: false,
      next: { label: 'Next', disabled: true, hidden: true, tooltip: { hidden: false, position: 'right' } },
      more:{ label: { on: 'Show less', off: 'Show more' }, tooltip: { hidden: false, position: 'left' } },
      mute: { label: { on: 'Unmute', off: 'Mute' }, disabled: false, hidden: false, tooltip: { hidden: false, position: 'left' } },
      pip = { label: { on: 'Disable PIP', off: 'PIP' }, disabled: false, hidden: false, tooltip: { hidden: false, position: 'left' } },      
      playsInline: true,
      playPause: { label: { on: 'Pause', off: 'Play' }, tooltip: { hidden: false, position: 'right' } },
      poster: undefined,
      preload: 'none',
      previous: { label: 'Previous', disabled: true, hidden: true, tooltip: { hidden: false, position: 'right' } },
      settings: { hidden: false, qualityLabel: 'QUALITY', playbackRatesLabel: 'PLAYBACK SPEED', playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]], subsLabel:'SUBTITLES'},
      skipTime: '1%',
      playbackRate: 1,
      src: [],
      subtitles: { label: { on: 'Disable subtitles', off: 'Enable subtitles' }, disabled: false, hidden: false, tooltip: { hidden: false, position: 'left' }, state: false, container: '', sources: [], default:'fr' },
      thumbnails: { src: undefined, number: 100 },
      volume: 0.8,
      volumeForced: false
   */
  static get src() {
    return clone(srcOptions)
  }
}
