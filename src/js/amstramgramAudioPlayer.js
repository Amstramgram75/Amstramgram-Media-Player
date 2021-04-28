//cSpell:words amstramgram amst oups beforeend tabindex mediaelement ipod

import EventEmitter from './tools/eventEmitter.js'
import AudioDefaultOptions from './params/audioDefaultOptions.js'
import { clone, isObject, mergeDeep, buildSrcParams } from './tools/utils.js'
import { _$, _$$ } from './tools/selector.js'
import pointerDetector from './tools/pointerDetector.js'
import AudioUI from './UI/audioUI.js'
import nodal from './UI/nodal.js'

const
  w = window,
  s = w.sessionStorage,
  UA = w.navigator.userAgent.toLowerCase(),
  isIos = /ipad|iphone|ipod/i.test(UA) && !w.MSStream,
  isMobile = isIos || /android/i.test(UA),
  isIE = (UA.indexOf("MSIE ") > 0) || (!!navigator.userAgent.match(/Trident.*rv\:11\./))


/**
 * Class AmstramgramAudioPlayer.
 * @extends EventEmitter
 */
export default class AmstramgramAudioPlayer extends EventEmitter {
  /* -------------------------------------------------------------------------- */
  /*                               INTERNAL UTILS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * @getter booleanAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element boolean attributes 
   * that we have to treat on initialization.
   */
  static get booleanAttributes() { return ['autoplay', 'loop'] }

  /**
   * @getter stringAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element string attributes 
   * that we have to treat on initialization.
   */
  static get stringAttributes() { return ['crossOrigin', 'preload', 'type'] }

  /**
   * @getter attributesToUpdate
   * @returns {Array}
   * @description returns the list of the HTML audio element attributes 
   * that we have to update when src changes.
   */
  static get attributesToUpdate() { return ['crossOrigin', 'loop', 'preload', 'type'] }

  /** 
   * @get buttons
   * @returns {Array}
   * @description :
   *    Each ui buttons should be updated through an individual setter.
   *    Return an array of all the buttons labels to simplify their declaration 
   *    in the instance trough a forEach loop.
   *    AmstramgramAudioPlayer : 
   *      ["download", "next", "more", "mute", "playPause", "previous", "settings", "subtitles"]
   *    AmstramgramVideoPlayer : 
   *      ["download", "next", "more", "mute", "playPause", "previous", "settings", "subtitles", "fullscreen", "pip"]
  */
  static get buttons() {
    return Object.keys(this.srcOptions).filter(k => isObject(this.srcOptions[k]) && (this.srcOptions[k].hasOwnProperty('label') || this.srcOptions[k].hasOwnProperty('hidden')))
  }
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
        appLabel: 'Audio Player',
        alwaysShowHours: false,
        compactMaxWidth: 600,
        errorMessage: "Oups ! Media can't be found !!!",
        hideControlsDelay: 5000,//Only used for vertical volume slider on not mobile devices whose pointer is not mouse
        miniMaxWidth: 500,
        timeSliderHelpText: 'Use Left/Right arrow keys to go backward/forward',
        timeSliderLabel: 'Time Slider',
        volumeBeforeMute: 0.8,
        volumeGroup: 0,
        volumeSliderHelpText: 'Use Up/Down arrow keys to increase/decrease the volume',
        volumeHorizontal: true,
        volumeSliderLabel: 'Volume slider'
      }
   */
  static #instanceOptions = AudioDefaultOptions.instance

  /** 
   * @get instanceOptions
   * @returns {Object}
   * @description return the current options for new instances
  */
  static get instanceOptions() { return clone(this.#instanceOptions) }

  /**
   * @private #srcOptions
   * @type {Object}
   * @description store the current options for new audio src
      #srcOptions = {
        autoplay: false,
        crossOrigin: undefined,
        download: { label: 'Download', disabled: false, hidden: false, tooltip: { hidden: false, left: true } },
        duration: 120,
        loop: false,
        more: { label: { on: 'Show less', off: 'Show more' }, tooltip: { hidden: false, left: true } },
        mute: { label: { on: 'Unmute', off: 'Mute' }, disabled: false, hidden: false, tooltip: { hidden: false, left: true } },
        next: { label: 'Next', disabled: true, hidden: true, tooltip: { hidden: false, left: false } },
        playbackRate: 1,
        playPause: { label: { on: 'Pause', off: 'Play' }, tooltip: { hidden: false, left: false } },
        preload: 'none',
        previous: { label: 'Previous', disabled: true, hidden: true, tooltip: { hidden: false, left: false } },
        settings: { hidden: false, qualityLabel: 'QUALITY', playbackRatesLabel: 'PLAYBACK SPEED', playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]], subsLabel: 'SUBTITLES' },
        skipTime: '1%',
        src: [],
        subtitles: { label: { on: 'Disable subtitles', off: 'Enable subtitles' }, disabled: false, hidden: false, tooltip: { hidden: false, left: true }, state: false, wrapper: '', container: '', sources: [], default: 'fr' },
        volume: 0.8,
        volumeForced: false,
      }
   */
  static #srcOptions = AudioDefaultOptions.src

  /** 
   * @get srcOptions
   * @returns {Object}
   * @description return the current options for new audio src
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
   * @private #players
   * @type {Array}
   * @description store the audio player instances
   */
  static #players = []

  /** 
   * @get players
   * @returns {Array}
   * @description : Returns a clone of the private field #players array.
  */
  static get players() { return [...this.#players] }

  /** 
   * @private #currentPlayer
   * @typeof {AmstramgramAudioPlayer} 
   */
  static #currentPlayer = undefined

  /** 
   * @get currentPlayer
   * @returns {AmstramgramAudioPlayer|undefined}
   * @description : Returns the current player or undefined if there is none.
  */
  static get currentPlayer() {
    return this.#currentPlayer
  }


  /* -------------------------------------------------------------------------- */
  /*                               PRIVATE FIELDS                               */
  /* -------------------------------------------------------------------------- */
  #init = false //Pass to true after the first src setting
  #paused = true //Playing status



  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  /**
   * @param {HTMLElement} media - HTMLMediaElement associated to the player
   * @param {Object} params - player parameters
   * @param {Function} callback - function called after the player initialization.
   * @WrappingClass {undefined|AmstramgramMediaPlayer} 
   *  If not provided, AmstramgramAudioPlayer is used as standalone
   *  If provided, it must be the AmstramgramMediaPlayer class.
   */
  constructor(media, params = {}, callback, WrappingClass = undefined) {
    //If the second argument is a function,
    if (typeof params === 'function') {
      callback = params
      params = {}
    }
    super()
    //If there is no media or if media is not an HTMLMediaElement, leaving...
    if (!media || (media.tagName != 'AUDIO' && media.tagName != 'VIDEO')) return
    //If WrappingClass is not provided, AmstramgramAudioPlayer is used as standalone 
    //and media must be an HTMLAudioElement. If not, leaving...
    else if (!WrappingClass && media.tagName != 'AUDIO') return
    //If WrappingClass is provided but is not an AmstramgramMediaPlayer instance, leaving...
    else if (WrappingClass && WrappingClass.name != 'AmstramgramMediaPlayer') return
    //If WrappingClass is provided but callback is not a function, leaving...
    else if (WrappingClass && (!callback || typeof callback != 'function')) return

    const
      Class = this.constructor,//AmstramgramAudioPlayer or AmstramgramVideoPlayer
      //myParams stores the parameters of the instance
      //Initially, it's just a clone af the class options
      myParams = clone(Class.options)

    //Time to begin HTML construction common to audio and video
    const $ = _$(document.createElement('div'))//This is our wrapper
    const $$ = _$$($())
    //Wrapper classes
    let classes = `amst__wrapper`
    //Special css class for IE11 to prevent some transition bugs
    if (window.document.documentMode) classes += ` amst__ie`

    //See './tools/selector.js' for details and usage
    $()
      .setAttributes({
        class: classes,
        'aria-label': `${myParams.appLabel}`,
        role: 'application'
      })
      .insertAdjacentHTML('beforeend', `
        <span class="amst__offscreen">${myParams.appLabel}</span>
        <div class="amst__container" tabindex="0">
          <div class="amst__mediaelement"></div>
        </div>
      `)
    media.parentNode.insertBefore($(), media)
    //Move the Html media element into the wrapper
    $('.amst__mediaelement').appendChild(media)

    //Add the HTML wrapper and media elements to the instance params object.
    myParams.$ = $
    myParams.$$ = _$$($())
    myParams.media = $(media)
    //And some useful information
    myParams.isIos = isIos
    myParams.isMobile = isMobile
    myParams.isIE = isIE
    myParams.type = (Class == AmstramgramAudioPlayer) ? 'audio' : 'video'

    /* -------------------------------------------------------------------------- */
    /*                        TREATING THE HTML ATTRIBUTES                        */
    /* -------------------------------------------------------------------------- */
    //First, we force the controls attribute to false
    media.controls = false

    params = buildSrcParams(params, media, false)

    //If the muted attribute is set
    if (media.muted) {
      //if a valid volume has been passed in parameters, it overrides the muted attribute
      if (!isNaN(params.volume) && params.volume > 0 && params.volume <= 1) {
        media.muted = false
        //If not, the volume property of the parameters is set to 0
      } else {
        params.volume = 0
      }
      //Removing the HTML attribute
      media.removeAttribute('muted')
    }
    /**
     * AmstramgramAudioPlayer.booleanAttributes = ["autoplay", "loop"]
     * AmstramgramVideoPlayer.booleanAttributes = ["autoplay", "loop", "playsInline"]
     * AmstramgramAudioPlayer.stringAttributes = ["crossOrigin", "preload"]
     * AmstramgramVideoPlayer.stringAttributes = ["crossOrigin", "preload", "poster"]
     * AmstramgramAudioPlayer.attributesToUpdate = ["crossOrigin", "loop", "preload"]
     * AmstramgramVideoPlayer.attributesToUpdate = ["crossOrigin", "loop", "preload", "playsInline"]
     */
    //Retrieving the boolean attributes
    Class.booleanAttributes.forEach(a => {
      //Parameters overrides HTML attributes
      params[a] = (typeof params[a] === 'boolean') ? params[a] : (media[a] == true) ? true : undefined
      //Removing attributes which don't need to be updated when src changes (autoplay).
      if (!Class.attributesToUpdate.includes(a)) media.removeAttribute(a)
    })
    //Retrieving the string attributes
    Class.stringAttributes.forEach(a => {
      //Parameters overrides HTML attributes
      params[a] = (typeof params[a] === 'string') ? params[a] : media.getAttribute(a)
      //Removing attributes which don't need to be updated when src changes (poster on video element).
      if (!Class.attributesToUpdate.includes(a)) media.removeAttribute(a)
    })
    /* -------------------------------------------------------------------------- */
    /*                      END TREATING THE HTML ATTRIBUTES                      */
    /* -------------------------------------------------------------------------- */



    //Updating default parameters with all the parameters of the instance 
    //(HTML attributes and constructor params arguments)
    mergeDeep(myParams, params)

    /**
     * Adding the pointerDetector data to the player params
     * pointerDetector.data = {
     *  pointerEventsInterface: "touch",
     *  pointerdown: "touchdown",
     *  pointerenter: "none",
     *  pointerleave: "none",
     *  pointermove: "touchmove",
     *  pointerup: "touchup"
     * }
     * */
    Object.assign(myParams, pointerDetector.data)
    myParams.currentPointerType = pointerDetector.currentPointerType


    //nodal is used on small screens to display the settings
    myParams.nodal = nodal

    //Sorting the parameters by alphabetical order to provide an easiest inspection
    const ordered = {}
    Object.keys(myParams).sort().forEach(function (key) {
      ordered[key] = myParams[key];
    })
    this.params = ordered

    /* -------------------------------------------------------------------------- */
    /*                          POINTER EVENTS MANAGEMENT                         */
    /* -------------------------------------------------------------------------- */
    const self = this
    if (pointerDetector.data.pointerEventsInterface == 'pointer') {
      function onPointerChange() {
        self.params.currentPointerType = pointerDetector.currentPointerType
        if (pointerDetector.currentPointerType == 'mouse') {
          $().classList.add('amst__mouse')
        } else {
          $().classList.remove('amst__mouse')
        }
      }
      pointerDetector.on('amst__pointerChange', onPointerChange)
      onPointerChange()
    } else if (pointerDetector.pointerEventsInterface == 'mouse') $().classList.add('amst__mouse')
    /* -------------------------------------------------------------------------- */
    /*                        END POINTER EVENTS MANAGEMENT                       */
    /* -------------------------------------------------------------------------- */


    //Add the instance to the static players array of the AmstramgramAudioPlayer class
    AmstramgramAudioPlayer.#players.push(this)

    //And build the UI
    this._buildUI()

    //Calling the setter src with the ordered parameters
    this.src = this.params

    /** 
     *  AmstramgramAudioPlayer : 
     *    ["download", "next", "mute", "playPause", "previous"]
     *  AmstramgramVideoPlayer : 
     *    ["download", "next", "mute", "playPause", "previous", "fullscreen", "pip"]
    */
    this.constructor.buttons.forEach(k => {
      Object.defineProperty(this, k, {
        set: (opt) => {
          let o = {}
          o[k] = opt
          mergeDeep(this.params, o)
          this.emit(`amst__${k}-should-update`)
        }
      })
    })

    //Instance is initialized
    this.#init = true
    //Calling the callback
    if (callback && typeof callback === "function") {
      setTimeout(_ => {
        callback.call(this)
        if (this.params.autoplay == true) {//Just to be sure that we let time to callback to execute
          setTimeout(_ => self.play(), 1)
        }
      }, 1)
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   PRIVATE                                  */
  /* -------------------------------------------------------------------------- */
  _buildUI() {
    if (this.constructor != AmstramgramAudioPlayer || this.init) return
    new AudioUI(this)
    this.params.$().classList.add('amst__audio')
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END PRIVATE                                */
  /* -------------------------------------------------------------------------- */




  /* -------------------------------------------------------------------------- */
  /*                               GETTERS/SETTERS                              */
  /* -------------------------------------------------------------------------- */

  /** 
    @get init
    @return {boolean}
    @description return true if the instance is initialized, false if not
  */
  get init() {
    return this.#init
  }

  /** 
    @set currentTime
    @param {Number}
    @description set the media currentTime
  */
  set currentTime(t) {
    try {
      this.params.media.currentTime = t
    } catch (e) {
      //IE11 throws an error if the media is not loaded
      console.warn(e)
    }
  }

  /** 
    @get currentTime
    @return {boolean}
    @description return the media currentTime
  */
  get currentTime() {
    return this.params.media.currentTime
  }

  /** 
    @set muted
    @param {boolean}
    @description If true, mute the volume. If not, unmute the volume
  */
  set muted(bool) {
    if (typeof bool == 'boolean') this.params.media.muted = bool
  }

  /** 
    @get muted
    @return {boolean}
    @description return true if the volume is muted, false if not
  */
  get muted() {
    return this.params.media.muted
  }

  /** 
    @get paused
    @return {boolean}
    @description return true if the player is paused, false if not
  */
  get paused() {
    return this.#paused
  }

  /** 
    @get playbackRate
    @return {number}
    @description return the media playbackRate
  */
  get playbackRate() {
    return this.params.media.playbackRate
  }

  /** 
    @set playbackRate
    @param {number}
    @description set the media playbackRate
  */
  set playbackRate(rate) {
    this.params.media.playbackRate = rate
  }

  /** 
    @get src
    @return {string}
    @description return the player src
  */
  get src() {
    return this.params.media.src
  }

  /** 
    @set src
    @param {string|object|array}
    @description set the player source
    src can be : 
    1.  a string pointing to a valid media source. 
          'assets/media.mp3'
    2.  an object with source and type keys:
          {
            src: 'assets/media.mp3',
            type: 'audio/mpeg',
          }
    3.  an array of objects. Each object must have a src and a quality keys referencing a string.
        The type key is optional but recommended.
          [
            {
              src: 'assets/media-128.mp3',
              quality: 'MP3-128K',
              type: 'audio/mpeg',
            }
            {
              src: 'assets/media-320.mp3',
              quality: 'MP3-320K',
              type: 'audio/mpeg',
            }
            {
              src: 'assets/media.wav',
              quality: 'Wav',
              type: 'audio/wave',
            },
          ]
    4.  an object with some options and a key src that can be a string (case 1), an object (case 2) or an array (case 3).
          {
            preload: auto,
            duration: 300,
            src: 'assets/media-128.mp3',
          }
        OR
          {
            preload: auto,
            duration: 300,
            src: { 
              src: 'assets/media-128.mp3',
              type: 'audio/mpeg',
            }
          }
        OR
          {
            preload: auto,
            duration: 300,
            src: [
              {
                src: 'assets/media-128.mp3',
                quality: 'MP3-128K',
                type: 'audio/mpeg',
              }
              {
                src: 'assets/media-320.mp3',
                quality: 'MP3-320K',
                type: 'audio/mpeg',
              }
              {
                src: 'assets/media.wav',
                quality: 'Wav',
                type: 'audio/mpeg',
              },
            ],
          }
          
  */
  set src(src) {
    this.pause()
    const 
      params = this.params, 
      media = params.media,
      type = params.type
    try {//IE will fail
      this.params.media.currentTime = 0
    } catch (e) { }

    //Not needed on first call since src = this.params
    if (this.init) {
      src = buildSrcParams(src, media)
      const mySrc = this.constructor.srcOptions
      mergeDeep(mySrc, src)
      mergeDeep(params, mySrc)
    }

    //Show the error message defined by the errorMessage instance option
    //if there is no valid src
    if (params.src.length == 0) {
      params.$().classList.add('amst__show-error')
      return
    }

    /*
    Retrieving the right src
    rightSrc is either :
      - the first src of the src array for which quality is the same as that stored in sessionStorage
      - the first src of the src array with the default property set to true
      - the first src of the src array
    */
    //rightSrc is :
    let rightSrc = params.src.find(el => el.quality && el.quality == s.getItem(`amst__${type}DefaultQuality`))
      || params.src.find(el => el.default == true)
      || params.src[0]
    //Updating the defaultQuality stored in sessionStorage
    if (rightSrc.quality && rightSrc.quality != s.getItem(`amst__${type}DefaultQuality`)) {
      s.setItem(`amst__${type}DefaultQuality`, rightSrc.quality)
    }
    //Setting the type attribute
    if (rightSrc.type) {
      media.setAttribute('type', rightSrc.type)
    } else {
      media.removeAttribute('type')
    }

    //Setting the src
    media.src = rightSrc.src
    media.playbackRate = params.playbackRate

    //Setting the media properties
    //AmstramgramAudioPlayer.attributesToUpdate = ['crossOrigin', 'loop', 'preload']
    //AmstramgramVideoPlayer.attributesToUpdate = ["crossOrigin", "loop", "preload", "playsInline"]
    this.constructor.attributesToUpdate.forEach(a => {
      media[a] = params[a]
    })

    this.emit('amst__src-change')
    if (this.init && params.autoplay == true) this.play()
  }

  /** 
    @get volume
    @return {number}
    @description return the player volume
  */
  get volume() {
    return (this.params.media.muted) ? 0 : this.params.media.volume
  }

  /**
   * For HTML Media Element, setting media.volume = 0 is not the same that setting media.muted = true
   * If you set media.muted to true, media.volume does not necessary change.
   * And setting media.volume to 0 does not necessary set media.muted to true.
   * In iOs, getting media.volume always return 1 and media.volume is read-only.
   * However, the volumechange event is dispatched in the two cases : changing the media.muted or media.volume properties.
   * This distinction is particularly important when dealing with the autoplay attribute.
   * For iOS, it will be effective only if the media is muted. Setting the volume to 0 will be without effect.
   * So, for our player, setting the volume to zero will set the muted property to true. 
   * And a non-null volume will force the muted property to false.
   */
  set volume(vol) {
    if (isNaN(vol) || vol < 0 || vol > 1 || vol == this.volume || (this.params.isMobile && vol != 0 && vol != 1)) return
    const
      params = this.params,
      media = params.media
    if (vol > 0) {
      media.volume = vol
      if (media.muted) media.muted = false
    }
    if (vol == 0 && !media.muted) media.muted = true
    //Send new volume to the players of the same volumeGroup
    AmstramgramAudioPlayer.players.filter(p => p != this && p.params.volumeGroup == params.volumeGroup && p.volume != vol).forEach(
      p => p.volume = vol
    )
  }
  /* -------------------------------------------------------------------------- */
  /*                             END GETTERS/SETTERS                            */
  /* -------------------------------------------------------------------------- */




  /* -------------------------------------------------------------------------- */
  /*                               PUBLIC METHODS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * @method hideControls()
   * @description : Does nothing. Just here for compatibility with AmstramgramMediaPlayer API.
   */
  hideControls() {
    return
  }

  /**
   * @method pause()
   * @description : pauses the player
   */
  pause() {
    if (!this.paused) {
      this.#paused = true
      if (!this.params.media.paused) this.params.media.pause()
      this.emit('amst__pause')
    }
  }

  /**
   * @method play()
   * @description : Makes the player plays
   */
  play() {
    if (this.paused && this.src) {
      const self = this
      if (this.params.media.paused) {
        if (AmstramgramAudioPlayer.currentPlayer && this != AmstramgramAudioPlayer.currentPlayer) {
          AmstramgramAudioPlayer.currentPlayer.pause()
          AmstramgramAudioPlayer.currentPlayer.emit('amst__should-reset')
        }
        this.#paused = false
        this.emit('amst__should-play')
        const media = this.params.media
        if (media.readyState == 0 && !isIE) {//Mainly for iOS
          //But IE will not dispatch the loadeddata event
          media.on('loadeddata', function onDataLoaded() {
            media.off('loadeddata', onDataLoaded)
            playIt()
          })
          media.load()
        } else playIt()
        function playIt() {
          const playPromise = media.play()
          if (playPromise !== undefined) {
            playPromise.then(playSucceed).catch(e => {
              self.emit('amst__pause')
            })
          } else {
            playSucceed()
          }
        }
      }
      function playSucceed() {
        self.emit('amst__play')
        AmstramgramAudioPlayer.#currentPlayer = self
      }
    }
  }

  /**
   * @method showControls()
   * @description : Does nothing. Just here for compatibility with AmstramgramMediaPlayer API.
   */
  showControls() {
    return
  }

  /**
   * @method toggle()
   * @description : Toggles the playback
   */
  toggle() {
    if (this.paused) {
      this.play()
    } else {
      this.pause()
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                             END PUBLIC METHODS                             */
  /* -------------------------------------------------------------------------- */
}
