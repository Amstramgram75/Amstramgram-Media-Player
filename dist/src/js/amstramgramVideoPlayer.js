//cSpell:words amstramgram amst oups
import AmstramgramAudioPlayer from './amstramgramAudioPlayer.js'
import VideoDefaultOptions from './params/videoDefaultOptions.js'
import { clone, mergeDeep } from './tools/utils.js'
import VideoUI from './UI/videoUI.js'



export default class AmstramgramVideoPlayer extends AmstramgramAudioPlayer {
  /* -------------------------------------------------------------------------- */
  /*                               INTERNAL UTILS                               */
  /* -------------------------------------------------------------------------- */
  /**
   * @getter booleanAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element boolean attributes 
   * that we have to treat on initialization.
   * ['autoplay', 'loop', 'playsInline']
   */
  static get booleanAttributes() { return [...AmstramgramAudioPlayer.booleanAttributes, 'playsInline'] }

  /**
   * @getter stringAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element string attributes 
   * that we have to treat on initialization.
   * ['crossOrigin', 'preload', 'poster']
   */
  static get stringAttributes() { return [...AmstramgramAudioPlayer.stringAttributes, 'poster'] }

  /**
   * @getter attributesToUpdate
   * @returns {Array}
   * @description returns the list of the HTML audio element attributes 
   * that we have to update when src changes.
   * ['crossOrigin', 'loop', 'preload', playsInline']
   */
  static get attributesToUpdate() { return [...AmstramgramAudioPlayer.attributesToUpdate, 'playsInline'] }
  /* -------------------------------------------------------------------------- */
  /*                             END INTERNAL UTILS                             */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   OPTIONS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * @private #instanceOptions
   * @type {Object}
   * @description store the current options for new instances
      #instanceOptions = {
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
      }
   */
  static #instanceOptions = VideoDefaultOptions.instance

  /** 
   * @get instanceOptions
   * @returns {Object}
   * @description return the current options for new instances
  */
  static get instanceOptions() { return clone(this.#instanceOptions) }


  /**
   * @private #srcOptions
   * @type {Object}
   * @description store the current options for new video src
      #srcOptions = {
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
        volumeForced: false,
      }
   */
  static #srcOptions = VideoDefaultOptions.src

  /** 
   * @get srcOptions
   * @returns {Object}
   * @description return the current options for new video src
  */
  static get srcOptions() { return clone(this.#srcOptions) }


  /** 
   * @set options
   * @param {Object} opt
   * @description : set the default options of the class.
  */
  static set options(opt) {
    new Array(this.#instanceOptions, this.#srcOptions).forEach(obj => { mergeDeep(obj, opt) })
  }

  /** 
   * @get options
   * @returns {Object}
   * @description : return the default options of the class.
  */
  static get options() {
    return { ...this.instanceOptions, ...this.srcOptions }
  }

  /* -------------------------------------------------------------------------- */
  /*                                 END OPTIONS                                */
  /* -------------------------------------------------------------------------- */


  /**
   * CONSTRUCTOR
   * @param {HTMLElement} media - HTMLMediaElement associated to the player
   * @param {Object} params - player parameters
   */
  constructor(media, params = {}, callback, WrappingClass) {
    super(media, params, callback, WrappingClass)
    if (media.tagName != 'VIDEO' || !callback || typeof callback != 'function' || !WrappingClass || WrappingClass.name !== 'AmstramgramMediaPlayer') return
  }


  _buildUI() {
    if (this.constructor != AmstramgramVideoPlayer || this.init) return
    new VideoUI(this)
    this.params.$().classList.add('amst__video')
  }

  /**
   * @method hideControls()
   * @description : Hides the video controls bar.
   */
  hideControls(){
    this.emit('amst__hideControls')
  }

  /**
   * @method showControls()
   * @description : Shows the video controls bar.
   */
  showControls(){
    this.emit('amst__showControls')
  }
}