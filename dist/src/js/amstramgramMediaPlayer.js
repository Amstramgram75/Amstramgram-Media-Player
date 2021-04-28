//cSpell:words amstramgram amst   

import AmstramgramAudioPlayer from './amstramgramAudioPlayer.js'
import AmstramgramVideoPlayer from './amstramgramVideoPlayer.js'
import EventEmitter from './tools/eventEmitter.js'


/* -------------------------------------------------------------------------- */
/*                                    UTILS                                   */
/* -------------------------------------------------------------------------- */
/**
 * @function getInstanceMethodNames
 * @param {instance} instance : instance of a class
 * @param {prototype} stop : prototype
 * @returns {array} 
 * @description : array filled with the methods of the instance provided as first parameter 
 * including all the inherited methods until we reach the optional prototype 
 * provided as second parameter.
 * The constructor and methods whose name begins by underscore are omitted.
 */
function getInstanceMethodNames(instance, stop) {
  let
    array = [],
    proto = Object.getPrototypeOf(instance)
  while (proto && proto !== stop) {
    Object.getOwnPropertyNames(proto)
      .forEach(name => {
        if (name !== 'constructor' && name.charAt(0) != '_') array.push(name)
      })
    proto = Object.getPrototypeOf(proto)
  }
  //https://stackoverflow.com/a/23282067
  //Returns the array without duplicates
  //We could use 
  //return Array.from(new Set(array))
  //but IE11 returns an empty array
  return array.filter(function(item, i, ar){ return ar.indexOf(item) === i; })
}

/**
 * @function getDescriptor
 * @param {string} prop : property for which whe need the descriptor
 * @param {object} instance : class instance 
 * @returns {object} property descriptor : 
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/getOwnPropertyDescriptor
 */
function getDescriptor(prop, instance) {
  let descriptor
  let proto = Object.getPrototypeOf(instance)
  while (Object.getPrototypeOf(proto) && !descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(proto, prop)
    proto = Object.getPrototypeOf(proto)
  }
  return descriptor
}
/* -------------------------------------------------------------------------- */
/*                                  END UTILS                                 */
/* -------------------------------------------------------------------------- */



/**
 * Class AmstramgramMediaPlayer.
 */
export default class AmstramgramMediaPlayer extends EventEmitter {
  /** 
   * @set options
   * @param {Object} params
   * @description : set the default options of the class.
   */
  static set options(params) {
    AmstramgramAudioPlayer.options = params
    AmstramgramVideoPlayer.options = params
  }

  /**
   * @get options
   * @returns {Object}
   * @description : returns the default options of the class.
   */
  static get options() {
    return { audio: AmstramgramAudioPlayer.options, video: AmstramgramVideoPlayer.options }
  }

  /** 
   * @set audioOptions
   * @param {Object} params
   * @description : set the default options of the audio players class.
   */
  static set audioOptions(params) {
    AmstramgramAudioPlayer.options = params
  }

  /**
   * @get audioOptions
   * @returns {Object}
   * @description : returns the default options of the audio players class.
   */
  static get audioOptions() {
    return AmstramgramAudioPlayer.options
  }

  /** 
   * @set videoOptions
   * @description : set the default options of the video players class.
   */
  static set videoOptions(params) {
    AmstramgramVideoPlayer.options = params
  }

  /** 
   * @get videoOptions
   * @returns {Object}
   * @description : returns the default options of the video players class.
   */
  static get videoOptions() {
    return AmstramgramVideoPlayer.options
  }

  /** 
   * @get players
   * @returns {Array}
   * @description : Returns an array of all instantiated players.
   */
  static get players() { return AmstramgramAudioPlayer.players }


  /** 
   * @get currentPlayer
   * @returns {AmstramgramAudioPlayer|AmstramgramVideoPlayer|undefined}
   * @description : Returns the current player or undefined if there is none.
  */
  static get currentPlayer() {
    return AmstramgramAudioPlayer.currentPlayer
  }



  /**
   * CONSTRUCTOR
   * @param {HTMLElement} media - HTMLMediaElement associated to the player
   * @param {Object} params - player parameters
   * @param {function} callback - function called after the instance has been initialized
   */
  constructor(media, params = {}, callback) {
    super()
    if (!media || (media.tagName != 'AUDIO' && media.tagName != 'VIDEO')) return

    const self = this
    //For IE11
    if (AmstramgramMediaPlayer.name === undefined) AmstramgramMediaPlayer.name = 'AmstramgramMediaPlayer'

    if (media.tagName == 'AUDIO') {
      new AmstramgramAudioPlayer(media, params, onPlayerInit, AmstramgramMediaPlayer)
    } else {
      new AmstramgramVideoPlayer(media, params, onPlayerInit, AmstramgramMediaPlayer)
    }

    function onPlayerInit() {
      /**
       * this = AmstramgramAudioPlayer or AmstramgramVideoPlayer initialized instance
       * self = current AmstramgramMediaPlayer instance
       */

      /**
       * Retrieves current initialized instance methods including inherited methods
       * but not those which belong to EventEmitter.
       * Necessary to get AmstramgramAudioPlayer methods if we treated an AmstramgramVideoPlayer instance.
       * Copy those methods to AmstramgramMediaPlayer instance
       * 
       * Object.getPrototypeOf(AmstramgramAudioPlayer.prototype) = EventEmitter
       * 
       * ["id", "init", "muted", "paused", "src", "volume", "pause", "play", "toggle"]
      */
      getInstanceMethodNames(this, Object.getPrototypeOf(AmstramgramAudioPlayer.prototype)).forEach(m => {
        let desc = {}
        if (getDescriptor(m, this).set) {//currentTime - muted - src - volume
          desc.set = (val) => this[m] = val
        }
        if (getDescriptor(m, this).get) {//init - currentTime - muted - paused - src - volume
          desc.get = _ => { return this[m] }
        }
        if (getDescriptor(m, this).value) {//pause - play -toggle
          desc.value = _ => this[m]()
        }
        Object.defineProperty(self, m, desc)
      })
      const inst = this

      //Copy AmstramgramAudioPlayer/AmstramgramVideoPlayer properties to AmstramgramMediaPlayer instance
      //AmstramgramAudioPlayer : ["events", "params", "download", "next", "more", "mute", "playPause", "previous", "settings", "subtitles"]
      //AmstramgramVideoPlayer : ["events", "params", "download", "next", "more", "mute", "playPause", "previous", "settings", "subtitles", "fullscreen", "pip"]
      Object.getOwnPropertyNames(this).forEach(p => {
        let desc = {}
        if (Object.getOwnPropertyDescriptor(this, p).set) {//download - next - more - mute - playPause - previous - settings - subtitles - fullscreen - pip
          desc.set = (val) => this[p] = val
        }
        if (Object.getOwnPropertyDescriptor(this, p).value) {//events - params
          desc.value = this[p]
        }
        Object.defineProperty(self, p, desc)
      })

      if (callback && typeof callback === "function") {
        setTimeout(_ => callback.call(self), 0)
      }
    }
  }
}