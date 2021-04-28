/****************************************
  amstramgramMediaPlayer.js
  @version : 1.0.0
  @licence : MIT
  @author : Amstramgram
  @url : https://amp.onfaitdessites.fr/
****************************************/


function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);

  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classCheckPrivateStaticAccess(receiver, classConstructor) {
  if (receiver !== classConstructor) {
    throw new TypeError("Private static access of wrong provenance");
  }
}

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
  if (descriptor === undefined) {
    throw new TypeError("attempted to " + action + " private static field before its declaration");
  }
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

//https://gist.github.com/mudge/5830382#gistcomment-2691957
class EventEmitter {
  constructor() {
    this.events = {};
  }

  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set();
    }

    return this.events[eventName];
  }

  on(eventsNames, fn) {
    const self = this;
    eventsNames.split(' ').forEach(eventName => {
      //Skip if fn is already registered
      if (!self._getEventListByName(eventName).has(fn)) {
        self._getEventListByName(eventName).add(fn);
      }
    });
    return this;
  }

  emit(eventName, ...args) {
    this._getEventListByName(eventName).forEach(function (fn) {
      fn.apply(this, args);
    }.bind(this));

    return this;
  }

  off(eventName, fn) {
    this._getEventListByName(eventName).delete(fn);
  }

}

/**
 * 
 * @param {String} events - Name of the events to throttle (separated by space)
 * @param {String} name 
 * @param {EventTarget} obj 
 */
let throttle = (events, name, obj) => {
  if (typeof obj == 'undefined') {
    if (typeof window !== 'undefined') obj = window;else return;
  }

  let running = false,
      func = e => {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      obj.dispatchEvent(new CustomEvent(name, {
        detail: e
      }));
      running = false;
    });
  };

  events.split(' ').forEach(event => obj.addEventListener(event, func));
};
/**
 * Return true if o is an Object
 * https://stackoverflow.com/a/37164538
 * Return true if o is an Object
 * @param {Object} o
 * @return {Boolean}
 */

function isObject(o) {
  return o && o.constructor === Object;
}
/**
 * @function mergeDeep
 * @param {Object} target
 * @param {Object} source
 * @description:
 * Deep merging source keys in target keys
 * Key is ignored if in source but not in target
 * target = {a:0, b:{c:1, {d:1, e:2}}}
 * source = {a:1, b:{c:2, {d:3,f:4}}}
 * result = {a:1, b:{c:2, {d:3,e:2}}}
 */

function mergeDeep(target, source) {
  if (isObject(target) && Object.isFrozen(target)) return;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key]);
      } else if (key in target && (typeof target[key] == typeof source[key] || target[key] === undefined)) {
        target[key] = source[key];
      }
    });
  }
}
/**
 * @function clone
 * @param {Object} o
 * @return {Object}
 * @description: returns the clone of an object and all of its keys
 */

function clone(o) {
  const copy = {};
  Object.keys(o).forEach(key => {
    copy[key] = isObject(o[key]) ? clone(o[key]) : o[key];
  });
  return copy;
}
/**
 * @function checkString
 * @param {string} s
 * @returns true if s is a non empty string / false if not
 */

function checkString(s) {
  return typeof s === 'string' && s.length > 0;
}
/**
 * @function buildSrc
 * @param {string|object|array} params 
 * @param {HTMLMediaElement} media 
 * @returns {array}
 * @description : returns an array of src objects
 *  - if params is a string, returns [{src: params}]
 *  - if params is an object with only src and type keys : 
 *      * if media can play the type property, returns [{src: params.src, type: params.type}]
 *      * if not, returns false
 *  - if params is an array : remove elements without a quality key 
 *    and elements that have a type property non playable by the media.
 *    returns an array of all the valid src objects.
 */


function buildSrc(params, media) {
  if (checkString(params)) {
    /**
     * new AmstramgramMediaPlayer('<audio>', 'path_to_audio_file.mp3')
     * @params : 'path_to_audio_file.mp3'
     * @return : [ { src: path_to_audio_file.mp3 } ]
     */
    return [{
      src: params
    }];
  }

  if (isObject(params) && Object.keys(params).length == 2 && params.src && params.type && checkString(params.src) && checkString(params.type)) {
    /**
    * new AmstramgramMediaPlayer('<audio>', {
    *    src: 'path_to_audio_file.mp3',
    *    type: 'audio/mpeg'
    *  })
    * @params : { src: 'path_to_audio_file.mp3', type: 'audio/mpeg }
    * @return : [ { src: 'path_to_audio_file.mp3', type: 'audio/mpeg } ]
    */
    return media.canPlayType(params.type) ? [params] : false;
  }

  if (Array.isArray(params)) {
    /**
    * new AmstramgramMediaPlayer('<audio>', [
    *  {
    *    src: 'path_to_audio_file.mp3',
    *    quality: 'MP3',
    *    type: 'audio/mpeg'
    *  },
    *  {
    *    src: 'path_to_audio_file2.mp3',
    *    type: 'audio/mpeg'
    *  },
    *  {
    *    src: 'path_to_audio_file3.mp3',
    *    quality: 'MP3-256 ',
    *    type: 'audio'
    *  },
    *  {
    *    quality: 'MP3-256 ',
    *    type: 'audio/mpeg'
    *  },
    *  {
    *    src: 'path_to_audio_file.wav',
    *    quality: 'WAV',
    *    type: 'audio/wav'
    *  },
    * ])
    * @return : [ { src: 'path_to_audio_file.mp3', quality: 'MP3', type: 'audio/mpeg' }, { src: 'path_to_audio_file.wav', quality: 'WAV', type: 'audio/wav' }]
    * Second object is removed because it doesn't have a quality property
    * Third object is removed because it has a non valid type
    * Third object is removed because it doesn't have a src property
    * 
    */
    if (params.length == 1) {
      /**
       * new AmstramgramMediaPlayer('<audio>', [{src: 'path_to_audio_file.mp3', quality: 'MP3', type: 'audio/mpeg'}])
       * @returns : [{ src: 'path_to_audio_file.mp3' }]
       * 
       * new AmstramgramMediaPlayer('<audio>', [{src: 'path_to_audio_file.mp3', quality: 'MP3', type: 'audio'}])
       * @returns : false. 
       * Because type is not valid.
       * 
       * <audio src="path_to_audio_file.mp3"></audio>
       * AND
       * <audio src="path_to_audio_file.mp3" type="audio/mpeg"></audio>
       * AND
       * <audio>
       *  <source src="path_to_audio_file.mp3">
       * </audio>
       * AND
       * <audio>
       *  <source src="path_to_audio_file.mp3" type="audio/mpeg" quality="MP3">
       * </audio>
       * @returns : [{ src: 'path_to_audio_file.mp3' }]
       * 
       * <audio src="path_to_audio_file.mp3" type="audio"></audio>
       * AND
       * <audio>
       *  <source src="path_to_audio_file.mp3" type="audio">
       * </audio>
       * @returns : false. 
       * Because type is not valid.
       * 
       */
      const o = params[0];

      if (o.src && checkString(o.src)) {
        if (o.type) {
          if (media.canPlayType(o.type)) return params;
          return false;
        }

        return [{
          src: o.src
        }];
      }
    }

    return params.filter(o => o.src && checkString(o.src) && o.quality && checkString(o.quality)).filter(o => !o.type || o.type && media.canPlayType(o.type));
  }

  return false;
}
/**
 * @function buildSrcParams
 * @param {string|object|array} params 
 * @param {HTMLMediaElement} media 
 * @param {*} init. If forced to false and if no valid src has been passed to the constructor
 *  checks the src provided in the HTML code
 * @returns {object}
 * @description : returns a full parameter object with a clean src property
 */


function buildSrcParams(params, media, init = true) {
  let result = buildSrc(params, media);
  if (result) return {
    src: result
  };

  if (isObject(params)) {
    /**
     * new AmstramgramMediaPlayer('<audio>', {
     *  src: 'path_to_audio_file.mp3'
     *  duration: 125,
     * })
     */
    result = buildSrc(params.src, media);

    if (result) {
      params.src = result;
      return params;
    }
  }

  if (!init) {
    //Get the source(s) defined in HTML code
    let sources = [];
    const sourcesTag = Array.from(media.querySelectorAll('source'));

    if (sourcesTag.length > 0) {
      sourcesTag.forEach(s => {
        let o = {};
        o.src = s.src;
        if (s.getAttribute('data-quality')) o.quality = s.getAttribute('data-quality');
        if (s.getAttribute('type')) o.type = s.getAttribute('type');
        if (Boolean(s.getAttribute('data-default'))) o.default = Boolean(s.getAttribute('data-default'));
        sources.push(o);
        s.remove();
      });
    } else if (media.src && media.src != '') {
      sources.push({
        src: media.src,
        type: media.getAttribute('type')
      });
    }

    result = buildSrc(sources, media);

    if (result) {
      params.src = result;
      return params;
    }
  }

  params.src = [];
  return params;
}
/**
 * @function secondsToTimeCode
 * @param {Number} t - time to convert
 * @param {Boolean} long - if true, force the hour display even when the time to convert is less than 3600 = 1 hour 
 * @return {String} time formatted
 * @description: Converts time given in seconds to traditional display
 * @example : 
 *    - secondsToTimeCode(135) -> 02:35
 *    - secondsToTimeCode(135, long) -> 00:02:35
 *    - secondsToTimeCode(7545) -> 02:05:45
 */

function secondsToTimeCode(t, long = false) {
  if (isNaN(t)) {
    return long ? '00:00:00' : '00:00';
  }

  t = Math.round(t);
  let h = Math.floor(t / 3600),
      m = Math.floor((t - h * 3600) / 60),
      s = Math.round(t % 60);
  h = h > 9 ? h + ':' : h > 0 ? '0' + h + ':' : long ? '00:' : '';
  m = m > 9 ? m : '0' + m;
  s = s > 9 ? s : '0' + s;
  return h + m + ':' + s;
}

//cSpell:words amstramgram oups
const instanceOptions$1 = {
  appLabel: 'Audio Player',
  alwaysShowHours: false,
  compactMaxWidth: 600,
  errorMessage: "Oups ! Media can't be found !!!",
  hideControlsDelay: 5000,
  //Only used for vertical volume slider on not mobile devices whose pointer is not mouse
  miniMaxWidth: 500,
  timeSliderHelpText: 'Use Left/Right arrow keys to go backward/forward',
  timeSliderLabel: 'Time Slider',
  volumeBeforeMute: 0.8,
  volumeGroup: 0,
  volumeSliderHelpText: 'Use Up/Down arrow keys to increase/decrease the volume',
  volumeHorizontal: true,
  volumeSliderLabel: 'Volume slider'
},
      srcOptions$1 = {
  autoplay: false,
  crossOrigin: undefined,
  download: {
    label: 'Download',
    disabled: false,
    hidden: false,
    tooltip: {
      hidden: false,
      left: true
    }
  },
  duration: 120,
  loop: false,
  more: {
    label: {
      on: 'Show less',
      off: 'Show more'
    },
    tooltip: {
      hidden: false,
      left: true
    }
  },
  mute: {
    label: {
      on: 'Unmute',
      off: 'Mute'
    },
    disabled: false,
    hidden: false,
    tooltip: {
      hidden: false,
      left: true
    }
  },
  next: {
    label: 'Next',
    disabled: true,
    hidden: true,
    tooltip: {
      hidden: false,
      left: false
    }
  },
  playbackRate: 1,
  playPause: {
    label: {
      on: 'Pause',
      off: 'Play'
    },
    tooltip: {
      hidden: false,
      left: false
    }
  },
  preload: 'none',
  previous: {
    label: 'Previous',
    disabled: true,
    hidden: true,
    tooltip: {
      hidden: false,
      left: false
    }
  },
  settings: {
    hidden: false,
    qualityLabel: 'QUALITY',
    playbackRatesLabel: 'PLAYBACK SPEED',
    playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]],
    subsLabel: 'SUBTITLES'
  },
  skipTime: '1%',
  src: [],
  subtitles: {
    label: {
      on: 'Disable subtitles',
      off: 'Enable subtitles'
    },
    disabled: false,
    hidden: false,
    tooltip: {
      hidden: false,
      left: true
    },
    state: false,
    wrapper: '',
    container: '',
    sources: [],
    default: 'fr'
  },
  volume: 0.8,
  volumeForced: false
};
/**
 * @class AudioDefaultOptions
 * @description Defines the default options of the AmstramgramAudioPlayer
 */

class AudioDefaultOptions {
  /**
   * @getter instance
   * @returns {Object}
   * @description returns the default options for an AmstramgramAudioPlayer instance
   */
  static get instance() {
    return { ...instanceOptions$1
    };
  }
  /**
   * @getter src
   * @returns {Object}
   * @description returns the default parameters for an AmstramgramAudioPlayer src
   */


  static get src() {
    return clone(srcOptions$1);
  }

}

/*
  PASSIVE EVENTS SUPPORT
  https://github.com/WICG/EventListenerOptions/blob/gh-pages/EventListenerOptions.polyfill.js
*/
let supportEventOptions = false;
document.createElement("div").addEventListener("test", _ => {}, {
  get once() {
    supportEventOptions = true;
    return false;
  }

});

let _$ = context => {
  context = typeof context === 'string' && document.querySelector(context) ? document.querySelector(context) : context;

  let $ = (selector = context) => {
    const el = typeof selector === 'string' && context.querySelector(selector) ? context.querySelector(selector) : selector;
    if (!el.tagName) return;

    el.css = newCSS => {
      if (typeof newCSS === 'string') {
        let v = window.getComputedStyle(el, null).getPropertyValue(newCSS);
        return isNaN(parseFloat(v)) ? v : parseFloat(v);
      } else {
        Object.assign(el.style, newCSS);
        return el;
      }
    };

    el.setAttributes = attrs => {
      Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
      return el;
    };

    el.on = function (events, handler, options = false) {
      events.split(' ').forEach(e => {
        if (supportEventOptions) el.addEventListener(e, handler, options);else {
          if (options.once === true) {
            el.addEventListener(e, function listener() {
              //CAVEAT: can't be remove by off
              handler();
              el.removeEventListener(e, listener);
            }, options.capture == true ? true : false);
          } else {
            el.addEventListener(e, handler, options.capture == true ? true : false);
          }
        }
      });
      return el;
    };

    el.off = function (events, handler) {
      events.split(' ').forEach(e => el.removeEventListener(e, handler));
      return el;
    };

    return el;
  };

  return $;
};

let _$$ = context => {
  context = typeof context === 'string' && document.querySelector(context) ? document.querySelector(context) : context;

  let $$ = selector => {
    const els = Array.isArray(selector) ? selector : Array.from(context.querySelectorAll(selector));

    els.css = newCSS => {
      if (typeof newCSS === 'string') {
        let v = window.getComputedStyle(els[0], null).getPropertyValue(newCSS);
        return isNaN(parseFloat(v)) ? v : parseFloat(v);
      } else {
        els.forEach(el => Object.assign(el.style, newCSS));
        return els;
      }
    };

    els.on = function (events, handler, options = false) {
      els.forEach(el => events.split(' ').forEach(e => {
        if (supportEventOptions) el.addEventListener(e, handler, options);else {
          if (options.once === true) {
            el.addEventListener(e, function listener() {
              //CAVEAT: can't be remove by off
              handler();
              el.removeEventListener(e, listener);
            }, options.capture == true ? true : false);
          } else {
            el.addEventListener(e, handler, options.capture == true ? true : false);
          }
        }
      }));
      return els;
    };

    els.off = function (events, handler) {
      els.forEach(el => events.split(' ').forEach(e => el.removeEventListener(e, handler)));
      return els;
    };

    return els;
  };

  return $$;
};

/**
 * @class PointerDetector extends EventEmitter
 * @description Singleton in charge of pointer events names standardization
 */

var _currentPointerType = new WeakMap();

var _data = new WeakMap();

class PointerDetector extends EventEmitter {
  /* -------------------------------------------------------------------------- */

  /*                               PRIVATE FIELDS                               */

  /* -------------------------------------------------------------------------- */
  //Stores the current pointer type ("touch" or "mouse")

  /*
    Stores the corresponding names for /
    - pointerEventsInterface ("pointer", "touch" or "mouse")
    - pointerenter ("pointerenter", "none", "mouseenter")
    - pointerleave ("pointerleave", "none", "mouseleave")
    - pointerup ("pointerup", "touchend", "mouseup")
    - pointerdown ("pointerdown", "touchstart", "mousedown")
    - pointermove ("pointermove", "touchmove", "mousemove")
  */

  /* -------------------------------------------------------------------------- */

  /*                              EVENT EMITTED                                 */

  /* -------------------------------------------------------------------------- */
  //amst__pointerChange: emitted when pointer type changes

  /* -------------------------------------------------------------------------- */

  /*                                  GETTERS                                   */

  /* -------------------------------------------------------------------------- */

  /**
   * @getter currentPointerType
   * @returns {string} "mouse" or "touch"
   */

  /**
   * @getter data
   * @returns {object}
   * {
   *  pointerEventsInterface: 'touch',
   *  pointerenter: 'none',
   *  pointerleave: 'none',
   *  pointerup: 'touchup',
   *  pointerdown: 'touchdown',
   *  pointermove: 'touchmove'
   * }
   */

  /* -------------------------------------------------------------------------- */

  /*                                 CONSTRUCTOR                                */

  /* -------------------------------------------------------------------------- */
  constructor() {
    //If first instantiation
    if (!PointerDetector.pointerDetector) {
      super();

      _currentPointerType.set(this, {
        writable: true,
        value: void 0
      });

      _data.set(this, {
        writable: true,
        value: {}
      });

      const w = window,
            s = w.sessionStorage,
            self = this,

      /*
        If PointerEvent is detected, pointerEventsInterface is set to 'pointer'.
        If not and if TouchEvent is detected, pointerEventsInterface is set to 'touch'.
        Finally, if neither PointerEvent nor TouchEvent are detected, pointerEventsInterface is set to 'mouse'.
      */
      pointerEventsInterface = _classPrivateFieldGet(this, _data).pointerEventsInterface = w.PointerEvent ? 'pointer' : w.TouchEvent ? 'touch' : 'mouse'; //Setting the resulting events names

      _classPrivateFieldGet(this, _data).pointerenter = pointerEventsInterface == 'touch' ? 'none' : pointerEventsInterface + 'enter';
      _classPrivateFieldGet(this, _data).pointerleave = pointerEventsInterface == 'touch' ? 'none' : pointerEventsInterface + 'leave';
      _classPrivateFieldGet(this, _data).pointerup = pointerEventsInterface == 'touch' ? 'touchend' : pointerEventsInterface + 'up';
      _classPrivateFieldGet(this, _data).pointerdown = pointerEventsInterface == 'touch' ? 'touchstart' : pointerEventsInterface + 'down';
      _classPrivateFieldGet(this, _data).pointermove = pointerEventsInterface + 'move'; //If not already stored, storing the currentPointerType value in session storage

      if (!s.hasOwnProperty('amst__currentPointerType')) {
        if (pointerEventsInterface == 'pointer') {
          //By default, we consider that touch is used;
          s.setItem('amst__currentPointerType', 'touch');
        } else {
          //pointerEventsInterface = 'mouse' or pointerEventsInterface = 'touch'
          s.setItem('amst__currentPointerType', pointerEventsInterface);
        }
      }

      _classPrivateFieldSet(this, _currentPointerType, s.getItem('amst__currentPointerType'));
      /*
        If the browser supports pointer events API, we have to know whether mouse is used or not to adapt the UI accordingly.
        When a change is detected, the information is send to all its instances.
      */


      if (pointerEventsInterface == 'pointer') {
        //Listening function
        function getPointerType(e) {
          //As long as no change is detected, we leave...
          if (e.pointerType == _classPrivateFieldGet(self, _currentPointerType)) return false; //If the pointer type is now mouse 

          if (e.pointerType == 'mouse') {
            w.removeEventListener('pointermove', getPointerType);
          } else {
            //We listen to the move event which occurred before pointerdown if a mouse is used
            w.addEventListener('pointermove', getPointerType);
          }

          _classPrivateFieldSet(self, _currentPointerType, e.pointerType);

          s.setItem('amst__currentPointerType', e.pointerType);
          self.emit('amst__pointerChange');
        }

        if (_classPrivateFieldGet(self, _currentPointerType) != 'mouse') w.addEventListener('pointermove', getPointerType);
        w.addEventListener('pointerdown', getPointerType);
      }

      PointerDetector.pointerDetector = this;
    }

    return PointerDetector.pointerDetector;
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   GETTERS                                  */

  /* -------------------------------------------------------------------------- */

  /**
   * @getter currentPointerType
   * @returns {string} "mouse" or "touch"
   */


  get currentPointerType() {
    return _classPrivateFieldGet(this, _currentPointerType);
  }
  /**
   * @getter data
   * @returns {object}
   * {
   *  pointerEventsInterface : 'touch',
   *  pointerenter: 'none',
   *  pointerleave: 'none',
   *  pointerup: 'touchup',
   *  pointerdown: 'touchdown',
   *  pointermove: 'touchmove'
   * }
   */


  get data() {
    return _classPrivateFieldGet(this, _data);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END GETTERS                                */

  /* -------------------------------------------------------------------------- */


} //Creating, freezing and exporting an unique instance


const pointerDetector = new PointerDetector();
Object.freeze(pointerDetector);

var _hidden = new WeakMap();

//cSpell:words amstramgram amst tabindex beforeend

/**
 * Class Button.
 * @HTML :
 *  <div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>
 */
class Button {
  /**
   * @private {Boolean} #hidden - Store the hidden property of the button
   */

  /**
   * PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * METHODS
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * called on amst__src-change and amst__${name}-should-update events
   */

  /**
   * EVENTS GENERATED
   * @event amst__name-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {String} name - button name
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   * @param {String} backgroundClass - class given to the button inner div - default : amst__svg-background
   * amst__svg-background is used by all buttons except the more button
   */
  constructor(name, player, ui, backgroundClass = "amst__svg-background") {
    _hidden.set(this, {
      writable: true,
      value: void 0
    });

    backgroundClass = backgroundClass === '' ? '' : ` class="${backgroundClass}"`; //Insertion of the button in the ui

    ui.insertAdjacentHTML('beforeend', `<div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>`);
    this.name = name;
    this.player = player;
    this.params = player.params[name];
    this.button = ui.querySelector(`.amst__${name}`);

    _classPrivateFieldSet(this, _hidden, this.params.hidden); //Listening to the click event


    this.button.addEventListener('click', e => this.player.emit(`amst__${name}-click`, this, e)); //Listening to the focus event

    this.button.addEventListener('focus', _ => this.player.emit('amst__focus'));
    player.on(`amst__src-change amst__${name}-should-update`, _ => this.update());
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHODS                                  */

  /* -------------------------------------------------------------------------- */

  /**
   * @method update()
   * @param {String} label - button label
   * toggleButtons pass a label depending of their state on/off
   * 
   * @description : updates the button properties (label/disabled/hidden/tooltip)
   * called on amst__src-change and amst__${name}-should-update events
   */


  update(label = this.params.label) {
    const b = this.button,
          p = this.params; //Setting the label

    if (label) b.setAttribute('aria-label', label); //Disabled property
    //More, playPause and settings buttons doesn't have disabled property

    if (p.disabled && p.disabled === true) {
      b.setAttribute('data-disabled', true);
    } else {
      b.removeAttribute('data-disabled');
    } //Hidden property


    if (p.hidden === true) {
      b.classList.add('amst__hidden');
    } else {
      b.classList.remove('amst__hidden');
    } //If we should show tooltip and if there is a label


    if (p.tooltip && p.tooltip.hidden === false && label != '') {
      b.classList.add('amst__tooltip');

      if (p.tooltip.left === true) {
        b.classList.add('amst__tooltip-left');
      } else {
        b.classList.remove('amst__tooltip-left');
      }
    } else {
      b.classList.remove('amst__tooltip', 'amst__tooltip-left');
    } //UI should resize if the hidden parameter changes


    if (p.hidden != _classPrivateFieldGet(this, _hidden)) {
      _classPrivateFieldSet(this, _hidden, p.hidden);

      this.player.emit('amst__should-resize');
    }

    this.player.emit(`amst__${this.name}-update`, this);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END METHODS                                */

  /* -------------------------------------------------------------------------- */


}

/**
 * Class ToggleButton.
 * @extends Button
 * 
 * @HTML :
    <div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>
 * @description : Used for Play, Mute, Subtitles, PIP and Fullscreen buttons.
 */

var _state$1 = new WeakMap();

class ToggleButton extends Button {
  /**
   * PRIVATE
   * @private {Boolean} #state - Store the button state
   */

  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * GETTER/SETTER
   * @property {Boolean} state - get/set the Button state
   */

  /**
   * OVERRIDDEN METHOD
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * according to the button state
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__name-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {String} name - button class name
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   * @param {String} backgroundClass - class given to the button inner div - 
   * default : amst__svg-background
   * amst__svg-background is used by all buttons except the more button
   */
  constructor(name, player, ui, backgroundClass) {
    //Call the button constructor
    super(name, player, ui, backgroundClass);

    _state$1.set(this, {
      writable: true,
      value: false
    });
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHODS                                  */

  /* -------------------------------------------------------------------------- */

  /**
   * @method update()
   * @description : updates the button properties (label/disabled/hidden/tooltip) 
   * according to the button state
   */


  update() {
    //Pass the label according to the state
    super.update(this.state ? this.params.label.on : this.params.label.off);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END METHODS                                */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                             STATE GETTER/SETTER                            */

  /* -------------------------------------------------------------------------- */

  /**
   * @getter
   * @return {Boolean}
   * @description : Return the button state
   */


  get state() {
    return _classPrivateFieldGet(this, _state$1);
  }
  /**
   * @setter
   * @param {Boolean} state
   * @description : Set the button state
   */


  set state(state) {
    if (state != _classPrivateFieldGet(this, _state$1)) {
      const b = this.button;

      if (state) {
        b.classList.add('amst__on');
      } else {
        b.classList.remove('amst__on');
      }

      _classPrivateFieldSet(this, _state$1, state);

      this.update();
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                           END STATE GETTER/SETTER                          */

  /* -------------------------------------------------------------------------- */


}

//cSpell:words amstramgram amst tabindex beforeend volumegroup
/**
 * Class MuteButton.
 * @extends ToggleButton
 * @extends Button
 * 
 * @HTML :
 *  <button type="button" class="amst__mute" tabindex="0"><div class="amst__svg-background"></div></button>
 * @description : 
 *  Mute/unmute the volume on click on mobile devices or if the volume is horizontal or if mouse is used.
 *  Keyboard shortcut: m
 *  - Listens to the 'volumechange' media event to 
 *      update the sessionStorage data and its state (on/off) if needed.
 *  - Listens to the 'amst__src-change' event emit by the player when a src is set 
 *      to store the volume data in sessionStorage if it doesn't exist yet 
 *      or if the volumeForced parameter is set to true
 */

class MuteButton extends ToggleButton {
  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * INHERITED GETTER/SETTER
   * @property {Boolean} state - get/set the Button state
   */

  /**
   * OVERRIDDEN METHODS
   * @method update() : 
   *  - updates the button properties (label/disabled/hidden/tooltip) by calling super
   *  - emit a amst_ui-should-resize event if the disabled attribute of the button changes
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__mute-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * METHOD
   * @method toggle() : 
   * @description : toggles the button state
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   */
  constructor(player, ui) {
    //Call the toggleButton constructor
    super('mute', player, ui);
    const playerParams = player.params,
          storage = window.sessionStorage;
    if (playerParams.isMobile) playerParams.volumeBeforeMute = 1; //Listening to volumechange event to update the button state

    playerParams.media.on('volumechange', _ => {
      const v = player.volume; //Updating storage

      storage.setItem(`amst__volumegroup${playerParams.volumeGroup}`, v); //Updating volumeBeforeMute if possible

      if (v > 0.1 && !playerParams.isMobile) playerParams.volumeBeforeMute = v;
      this.state = player.muted;
    });
    player.on('amst__src-change', _ => {
      if (playerParams.volumeForced === true || !storage.getItem(`amst__volumegroup${playerParams.volumeGroup}`)) {
        storage.setItem(`amst__volumegroup${playerParams.volumeGroup}`, playerParams.volume); //If not and if there is already a relevant value stored :
      } else if (storage.getItem(`amst__volumegroup${playerParams.volumeGroup}`)) {
        //this value is set to the volume
        playerParams.volume = Number(storage.getItem(`amst__volumegroup${playerParams.volumeGroup}`));
      }

      player.volume = playerParams.volume;
      this.state = player.muted;
    }).on('amst__mute-click', _ => {
      if (playerParams.isMobile || playerParams.currentPointerType == 'mouse' || playerParams.volumeOrientation == 'horizontal') {
        this.toggle();
      }
    }); //Keyboard events

    playerParams.$().on('keydown', e => {
      if (this.params.disabled || this.params.hidden || e.which != 77) return;
      e.preventDefault();
      this.toggle(); //Reset focus to force the amst__focus event

      this.button.blur();
      this.button.focus();
    });
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHODS                                  */

  /* -------------------------------------------------------------------------- */


  update() {
    const p = this.player.params;

    if (!p.isMobile) {
      if (this.params.hidden == true) {
        p.$('.amst__volume').classList.add('amst__hidden');
      } else {
        p.$('.amst__volume').classList.remove('amst__hidden');
      }
    }

    super.update();
  }
  /**
   * @method toggle()
   * @description : toggles the button state
   */


  toggle() {
    this.state = !this.state;
    this.player.volume = this.state ? 0 : this.player.params.volumeBeforeMute;
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END METHOD                                 */

  /* -------------------------------------------------------------------------- */


}

//cSpell:words amstramgram amst tabindex beforeend
/**
 * Class Slider.
 * @extends EventEmitter
 * 
 * @HTML :
    <div class="amst__slider">
      <div class="amst__slider-total">
        <div class="amst__slider-current"></div>
      </div>
    </div>
  *
  * Listens to the pointer events on amst__slider-total
  * Sends the ratio of the pointer event location relative to the referenceRect,
  * ie the amst__slider-total container
 */

class Slider extends EventEmitter {
  /**
   * PROPERTIES
   * @property params - player parameters
   * @property slider - $('.amst__slider')
   * @property total - $('.amst__slider-total')
   * @property current - $('.amst__slider-current')
   * @property referenceRect - total.getBoundingClientRect()
   */

  /**
   * EVENT DISPATCHED
   * @event amst__slider-change : send corresponding ratio of the pointerEvent location 
   * relative to the referenceRect
   */

  /**
   * EVENTS GENERATED
   * @event amst__focus : dispatch when slider is focused
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui to which the slider will be added
   * @param {Boolean} vertical - if false, the slider is horizontal
   * @param {HTMLElement} reactiveArea - HTML element listening to the pointer events
   */
  constructor(player, ui, vertical = false, reactiveArea = undefined) {
    super(); //Slider HTML insertion

    ui.insertAdjacentHTML('beforeend', `
      <div class="amst__slider" aria-valuemin="0" aria-valuemax="1" role="slider" tabindex="0">
        <div class="amst__slider-total">
          <div class="amst__slider-current"></div>
        </div>
      </div>
    `);

    const self = this,
          $ = _$(ui.querySelector('.amst__slider')),
          params = player.params; //Instance properties used only by inherited classes


    this.params = params;
    this.slider = $();
    this.total = $('.amst__slider-total');
    this.current = $('.amst__slider-current');
    this.referenceRect = this.total.getBoundingClientRect();
    this.slider.on('focus', _ => player.emit('amst__focus')); //Show videoUI controls 
    //If reactiveArea is not specified, it's set to the slider itself

    reactiveArea = reactiveArea || $(); //Getting the reference position/dimension. 
    //Those data change on scroll and resize events unified and throttled by the amst__resize event.

    player.on('amst__resize', referenceRectUpdate); //But vertical sliders are hidden by default, so we have to wait for mouseenter event.

    if (vertical) reactiveArea.on(params.pointerenter, referenceRectUpdate); //Getting the reference position/dimension on player initialization

    params.media.on('loadedmetadata', referenceRectUpdate); //Pointer events listeners

    function pointerdown(e) {
      const ref = self.referenceRect,
            cleanEvents = 'pointerId' in e ? `${params.pointerup}` : `${params.pointerleave} ${params.pointerup}`;
      if ('pointerId' in e) reactiveArea.setPointerCapture(e.pointerId); //Get the ratio between the coordinates of the pointer position relative to the reference

      function getRatio(e) {
        let ratio;
        const x = e.clientX || e.pageX - window.pageXOffset,
              y = e.clientY || e.pageY - window.pageYOffset;

        if (x && y) {
          if (vertical) {
            ratio = y - ref.top;
            ratio = 1 - ratio / ref.height;
          } else {
            ratio = x - ref.left;
            ratio = ratio / ref.width;
          } //Ensure that ratio is between 0 and 1


          ratio = Math.max(0, Math.min(ratio, 1)); //Emit the event

          self.emit('amst__slider-change', ratio);
        }
      }

      getRatio(e);

      function clean() {
        reactiveArea.off(`${params.pointermove} ${params.pointerup}`, getRatio).off(cleanEvents, clean);
      } //As soon as pointer is down, we watch for move and up to get ratio changes
      //On leave and up, we stop watching


      reactiveArea.on(`${params.pointermove} ${params.pointerup}`, getRatio).on(cleanEvents, clean);
    } //Start listening on pointerdown event


    reactiveArea.on(params.pointerdown, pointerdown);

    function referenceRectUpdate() {
      //Timer to be sure to get right dimensions when entering fullscreen
      //On Chrome, if no timer, 
      //self.total.getBoundingClientRect().width = 0 
      //when entering fullscreen
      setTimeout(_ => {
        self.referenceRect = self.total.getBoundingClientRect();
      }, 1);
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */


}

//cSpell:words amstramgram amst tabindex valuenow valuetext afterbegin
/**
 * Class VolumeSlider.
 * @extends Slider
 * @extends EventEmitter
 * 
 * @HTML :
    <div class="amst__slider" aria-label="${params.volumeSliderLabel}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-valuetext="100%" role="slider" tabindex="0">
      <span class="amst__offscreen">${params.volumeHelpLabel}</span>
      <div class="amst__slider-total">
        <div class="amst__slider-current"></div>
      </div>
    </div>
  * Listening to the pointer events on amst__slider-total
  * Send the corresponding ratio of the pointer event location relative to the referenceRect
 */

class VolumeSlider extends Slider {
  /**
   * INHERITED PROPERTIES
   * @property params - player instance parameters
   * @property slider - $('.amst__slider')
   * @property total - $('.amst__slider-total')
   * @property current - $('.amst__slider-current')
   * @property referenceRect - total.getBoundingClientRect()
   */

  /**
   * INHERITED EVENT DISPATCHED
   * @event amst__slider-change : send corresponding ratio of the pointerEvent location 
   * relative to the referenceRect
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__focus : dispatch when slider is focused
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui to which the slider will be added
   * @param {Boolean} vertical - If true, displays a vertical slider
   */
  constructor(player, ui, vertical = false) {
    super(player, ui, vertical);
    const slider = this.slider,
          params = this.params,
          media = params.media,
          current = this.current; //HTML adjustments

    slider.setAttribute('aria-label', player.params.volumeSliderLabel);
    slider.insertAdjacentHTML('afterbegin', `<span class="amst__offscreen">${player.params.volumeSliderHelpText}</span>`); //Keyboard events

    params.$().on('keydown', e => {
      //If the muteButton is operant
      if (params.mute.disabled !== true && params.mute.hidden !== true) {
        if ([38, 40].includes(e.which) && !e.shiftKey) e.preventDefault();else return; //Reset focus to force the amst__focus event

        slider.blur();
        slider.focus();

        switch (e.which) {
          case 40:
            //Arrow Down decreases the volume
            player.volume = Math.max(0, player.volume - 0.05);
            break;

          case 38:
            //Arrow Up increases the volume
            player.volume = Math.min(1, player.volume + 0.05);
            break;
        }
      }
    }, false); //Update the player volume when slider changes

    this.on('amst__slider-change', vol => player.volume = vol); //on volume changes

    media.on('volumechange', update); //on player initialization

    player.on('amst__src-change', update);

    function update() {
      const v = Math.round(player.volume * 100);
      current.style.width = v + '%';
      slider.setAttributes({
        'aria-valuenow': v / 100,
        'aria-valuetext': v + '%'
      });
    } //Prevent change of the volumeSliderLabel and volumeHelpLabel parameters


    Object.defineProperty(params, 'volumeSliderLabel', {
      writable: false
    });
    Object.defineProperty(params, 'volumeSliderHelpText', {
      writable: false
    });
  }

}

//cSpell:words amstramgram amst tabindex valuenow valuetext beforeend
/**
 * @HTML :
    <div class="amst__volume">
      <div class="amst__volume-wrapper">
        <div role="button" class="amst__mute amst__tooltip amst__tooltip-left" tabindex="0" aria-label="Mute"></div>
        <div class="amst__slider" aria-label="Volume slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-valuetext="100%" role="slider" tabindex="0">
          <span class="amst__offscreen">Use Up/Down arrow keys to increase/decrease the volume</span>
          <div class="amst__slider-total">
            <div class="amst__slider-current" aria-valuenow="100" aria-valuetext="100%" style="width: 100%;"></div>
          </div>
        </div>
      </div>
    </div>
  * @description
  * Only used for not mobile devices
  * Just a wrapper extending the VolumeSlider and containing the Mute Button
 */

class VolumeButton extends VolumeSlider {
  /**
   * INHERITED PROPERTIES
   * @property params - player instance parameters
   * @property slider - $('.amst__slider')
   * @property total - $('.amst__slider-total')
   * @property current - $('.amst__slider-current')
   * @property referenceRect - total.getBoundingClientRect()
   */

  /**
   * INHERITED EVENT DISPATCHED
   * @event amst__slider-change : send corresponding ratio of the pointerEvent location 
   * relative to the referenceRect
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__focus : dispatch when slider is focused
  
  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   */
  constructor(player, ui) {
    const params = player.params,
          volumeOrientation = params.volumeHorizontal !== true ? ' amst__vertical' : ''; // volumeOrientation = (params.volumeOrientation == 'vertical') ? ' amst__vertical' : ''
    //Volume wrapper HTML insertion

    ui.insertAdjacentHTML('beforeend', `<div class="amst__volume${volumeOrientation}"><div class="amst__volume-wrapper"></div></div>`);
    const wrapper = ui.querySelector('.amst__volume-wrapper'); //Mute button HTML insertion

    const muteButton = new MuteButton(player, wrapper); //volumeSlider instantiation

    super(player, wrapper, volumeOrientation == ' amst__vertical'); //Prevent change of the volumeHorizontal parameter

    Object.defineProperty(params, 'volumeHorizontal', {
      writable: false
    });
    /**
     * On not mobile device with touchscreen, we have to allow volume adjustment.
     * So we need to set up a special mechanism for vertical volume button.
     * A simple tap on loudspeaker icon will show/hide the slider after a 250ms delay.
     * The slider appears when we attribute it the amst__show class.
     * A double tap will toggle the button state.
     * A double tap is defined as two successive taps in less than 250ms.
     */

    const slider = this.slider;
    let //Timeout used to hide the slider after the delay given by the instance parameter hideControlsDelay
    hideSliderTimeout = false,
        //Timeout used to confirm simple tap
    clickTimeout = false,
        //clickTimeout duration
    delay = 250,
        //Store the first tap timestamp
    timeNow = 0; //Hides the slider after the delay given by the instance parameter hideControlsDelay 

    function hideSlider() {
      //Only if necessary...
      if (params.volumeOrientation == 'vertical' && !params.isMobile && params.currentPointerType != 'mouse') {
        if (hideSliderTimeout) clearTimeout(hideSliderTimeout);
        hideSliderTimeout = setTimeout(_ => {
          hideSliderTimeout = false;
          slider.classList.remove('amst__show');
        }, params.hideControlsDelay);
      }
    } //Reset the hideSliderTimeout when volume changes


    params.media.on('volumechange', hideSlider);

    if (params.volumeOrientation == 'vertical') {
      //Hides the slider if main video controls are hidden
      if (params.type == 'video') {
        player.on('amst__controlsAreHidden', _ => {
          if (params.currentPointerType != 'mouse') slider.classList.remove('amst__show');
        });
      }

      muteButton.button.addEventListener(params.pointerdown, _ => {
        //Only if necessary...
        if (params.currentPointerType != 'mouse') {
          //Canceling the hideSliderTimeout timer
          if (hideSliderTimeout) clearTimeout(hideSliderTimeout); //If first tap

          if (timeNow == 0) {
            //Stores the timestamp
            timeNow = Date.now(); //Set up the clickTimeout timer

            clickTimeout = setTimeout(_ => {
              //Reset
              timeNow = 0;
              slider.classList.toggle('amst__show');

              if (slider.classList.contains('amst__show')) {
                //Delayed the slider hiding
                hideSlider(); //The amst__optimizedScrollResize event allow to re-calculate the slider position

                window.dispatchEvent(new Event('amst__optimizedScrollResize'));
              }
            }, delay); //Second tap
            //If timeNow != 0, that is to say that the clickTimeout timer is still pending.
            //So, it's a double tap !
          } else {
            //Reset all
            clearTimeout(clickTimeout);
            clearTimeout(hideSliderTimeout);
            timeNow = 0; //Toggle the button state

            muteButton.toggle(); //Hides the slider

            slider.classList.remove('amst__show');
          }
        }
      });
    }
  }

}

//cSpell:words amstramgram amst currenttime beforeend afterbegin LOADEDBAR valuenow valuetext
/**
 * Class TimeSlider.
 * @HTML :
    <div class="amst__time amst__time-current" role="timer" aria-live="off"><span class="amst__currenttime"></span></div>
    <div class="amst__time-rail">
      <div class="amst__time-slider">
        <div class="amst__slider">
          <div class="amst__slider-total">
            <canvas class="amst__loaded-bar"></canvas>
            <div class="amst__slider-current"></div>
            <div class="amst__buffering-bar amst__hidden"></div>
            <div class="amst__cursor"><div></div></div>
            <div class="amst__seeking-wrapper">
              <div class="amst__time amst__seeking"><span></span></div>
            </div>
            <div class="amst__time-handler"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="amst__time amst__time-duration"><span class="amst__duration"></span></div>
 */

class TimeSlider extends Slider {
  /**
   * INHERITED PROPERTIES
   * @property params - player parameters
   * @property slider - $('.amst__slider')
   * @property total - $('.amst__slider-total')
   * @property current - $('.amst__slider-current')
   * @property referenceRect - total.getBoundingClientRect()
   */

  /**
   * INHERITED EVENT DISPATCHED
   * @event amst__slider-change : send corresponding ratio of the pointerEvent location 
   * relative to the referenceRect
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__focus : dispatch when slider is focused
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui to which the slider will be added
   */
  constructor(player, ui) {
    ui.insertAdjacentHTML('beforeend', `
      <div class="amst__time amst__time-current" role="timer" aria-live="off"><span class="amst__currenttime"></span></div>
      <div class="amst__time-rail">
        <div class="amst__time-slider"></div>
      </div>
      <div class="amst__time amst__time-duration"><span class="amst__duration"></span></div>
    `);

    const $ = _$(ui.querySelector('.amst__time-slider')); //Insert the slider in the ui
    //Reactive area is set to the ui


    super(player, $(), false, $());
    $('.amst__slider').insertAdjacentHTML('afterbegin', `<span class="amst__offscreen">${player.params.timeSliderHelpText}</span>`);
    $('.amst__slider').setAttribute('aria-label', player.params.timeSliderLabel); //HTML adjustments

    this.total.insertAdjacentHTML('afterbegin', '<canvas class="amst__loaded-bar"></canvas>');
    this.total.insertAdjacentHTML('beforeend', `
      <div class="amst__buffering-bar"></div>
      <div class="amst__cursor"><div></div></div>
      <div class="amst__seeking-wrapper">
        <div class="amst__time amst__seeking">
          <span></span>
        </div>
      </div>
      <div class="amst__time-handler"></div>
    `);
    const self = this,
          params = this.params,
          media = params.media,
          wrapper = params.$(),
          slider = this.slider,
          current = this.current,
          handler = $('.amst__time-handler'),
          cursor = $('.amst__cursor'),
          seeking = $('.amst__seeking-wrapper'),
          seekingTime = $('.amst__seeking-wrapper span');
    let mustShowHours = params.alwaysShowHours,
        buffered,
        seekingOffset;
    player.on('amst__src-change', _ => {
      //Remove the slider changes listener
      this.off('amst__slider-change', update);
      buffered = undefined;
      seekingOffset = undefined;
      updateDuration();
    });
    media.on('timeupdate', update).on('progress', updateBuffer).on('durationchange', updateDuration).on('loadedmetadata', _ => this.on('amst__slider-change', update)).on('ended', _ => {
      media.currentTime = 0;
      player.pause();
    });

    function updateDuration() {
      if (media.duration) params.duration = media.duration;
      mustShowHours = params.alwaysShowHours || params.duration >= 3600;

      if (mustShowHours) {
        params.$$('.amst__time').forEach(el => el.classList.add('amst__long'));
      } else {
        params.$$('.amst__time').forEach(el => el.classList.remove('amst__long'));
      }

      params.$('.amst__currenttime').innerHTML = secondsToTimeCode(media.currentTime || 0, mustShowHours);
      params.$('.amst__duration').innerHTML = secondsToTimeCode(params.duration, mustShowHours);
      slider.setAttribute('aria-valuemax', params.duration);
      update(media.currentTime / params.duration);
    } //Left and right Arrows move the playback head by a step defined by the skipTime parameter.


    wrapper.on('keydown', e => {
      if ([37, 39].includes(e.which) && wrapper.classList.contains('amst__loadedmetadata')) e.preventDefault();else return; //Reset focus to force the amst__focus event

      slider.blur();
      slider.focus(); //The skipTime parameter can be a percent or an integer

      const skipTime = typeof params.skipTime == 'string' && params.skipTime.slice(-1) == '%' ? parseInt(params.skipTime) * media.duration / 100 : parseInt(params.skipTime);

      switch (e.which) {
        case 37:
          //Arrow Left
          media.currentTime = Math.max(0, media.currentTime - skipTime);
          break;

        case 39:
          //Arrow Right
          media.currentTime = Math.min(media.duration, media.currentTime + skipTime);
          break;
      }
    }, false);
    /* -------------------------------------------------------------------------- */

    /*                            LOADEDBAR MANAGEMENT                            */

    /* -------------------------------------------------------------------------- */

    const loadedBar = $('.amst__loaded-bar'),
          ctxLoadedBar = loadedBar.getContext('2d');
    loadedBar.height = 0;

    function updateBuffer() {
      //Setting the height attribute of the canvas and the fillStyle color on initialization
      if (!loadedBar.height) {
        loadedBar.height = loadedBar.offsetHeight;
        ctxLoadedBar.fillStyle = loadedBar.css('color');
      } //If the present media TimeRanges is different from the one stored
      //we update the canvas


      if (!compareTimeRanges(media.buffered, buffered)) {
        ctxLoadedBar.clearRect(0, 0, loadedBar.width, loadedBar.height);
        let inc = loadedBar.width / media.duration;

        for (let i = 0; i < media.buffered.length; i++) {
          let start = media.buffered.start(i) * inc,
              width = media.buffered.end(i) * inc - start;
          new AmstRoundedRect(ctxLoadedBar, loadedBar.height, start, width);
        }

        buffered = media.buffered;
      }
    }
    /* -------------------------------------------------------------------------- */

    /*                          END LOADEDBAR MANAGEMENT                          */

    /* -------------------------------------------------------------------------- */
    //Unless we're sure that the device only supports touch events,
    //we throttle the pointermove event and listening to it to update cursor and seeking elements positions  


    if (params.pointerEventsInterface != 'touch') throttle(params.pointermove, 'amst__optimizedPointerMove', $());
    $().on('amst__optimizedPointerMove', e => {
      if (!media.duration || e.detail.pointerType && e.detail.pointerType == 'touch') return; //The seeking element indicates the media time corresponding to the pointer position.
      //The deal is to avoid that it goes beyond the cursor boundaries when this one reaches the slider edges
      //So we need to know its width and also these of the cursor
      //Those measures are made each time the media source changes .

      if (!seekingOffset) {
        //If not yet known
        const cursorInner = $('.amst__cursor>div');
        seekingOffset = 0.5 * seeking.css("width");
        seekingOffset -= parseInt(window.getComputedStyle(cursorInner, ':after').getPropertyValue("border-bottom-width"));
        seekingOffset -= 0.5 * cursorInner.css('width');
      } //Getting the pointer horizontal position relative to the slider


      const x = e.detail.clientX || e.detail.pageX - window.pageXOffset;
      let pos = x - this.referenceRect.left; //The reactive area is much wider than the slider
      //And we must restrain the result

      pos = Math.max(Math.min(pos, this.referenceRect.width), 0); //Updating the time indicator

      const ratio = pos / this.referenceRect.width;
      seekingTime.innerHTML = secondsToTimeCode(media.duration * ratio, mustShowHours); //the cursor position

      cursor.css({
        transform: `translateX(${pos}px)`
      }); //and the seeking position.
      //We manage so it does not overflow the slider

      pos = Math.max(pos, seekingOffset);
      pos = Math.min(pos, this.referenceRect.width - seekingOffset);
      seeking.css({
        transform: `translateX(${pos}px)`
      }); //For the video player on desktop, the pointer movement must update the thumb displayed
      //This event is eventually treated in the videoUI class

      if (params.type == 'video') this.emit('amst__move-over-time-slider', ratio);
    });
    /** 
     * @function update
     * @param {Number|Event} ratio 
     * @description : Update the slider components.
     * ratio is either:
     *    - a number given by slider changes listener.
     *    - the media timeupdate event.
     * We declare a updateTimeout to prevent the timeupdate function call as long as the slider is updated by the user
    */

    let updateTimeout, updateTimeRailAnimation;

    function update(ratio) {
      cancelAnimationFrame(updateTimeRailAnimation);
      if (!params.duration) return;

      if (typeof ratio === 'number' && ratio > 0) {
        //update is called by the slider change event
        //Suspend the media timeupdate event listener
        media.off('timeupdate', update);
        clearTimeout(updateTimeout); //Update the media currentTime

        media.currentTime = ratio * params.duration; //Reactivate the media timeupdate event listener after 50ms

        updateTimeout = setTimeout(_ => media.on('timeupdate', update), 50);
      } //Update the slider components


      updateTimeRail();
      updateBuffer();
      const currentTime = media.currentTime; //Update all the player current time indicators

      params.$$('.amst__currenttime').forEach(el => el.innerHTML = secondsToTimeCode(currentTime, mustShowHours)); //Update the slider attributes

      slider.setAttributes({
        'aria-valuenow': currentTime,
        'aria-valuetext': secondsToTimeCode(currentTime)
      });
    }

    function updateTimeRail() {
      let ratio = media.currentTime / params.duration;
      ratio = Math.max(0, Math.min(ratio, 1));
      current.style.transform = `scaleX(${ratio})`;
      handler.style.transform = `translateX(${ratio * self.referenceRect.width}px)`;
      if (params.type == 'video') self.emit('amst__time-slider-update', ratio);
      if (!media.paused) updateTimeRailAnimation = requestAnimationFrame(updateTimeRail);
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */


} //http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html

class AmstRoundedRect {
  constructor(ctx, h, x, w) {
    let y = 0,
        r = 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

}
/**
 * @function compareTimeRanges
 * @param {TimeRanges} t1 
 * @param {TimeRanges} t2 
 * @description compares two TimeRanges objects.
 * @returns {Boolean} true if the two TimeRanges are equal, false if they are different
 */


function compareTimeRanges(t1, t2) {
  if (!t1 || !t2 || t1.length != t2.length) {
    return false;
  } else {
    for (let i = 0; i < t1.length; i++) {
      //Comparing recursively each TimeRanges items
      //If we find a difference, we stop and return false
      if (t1.start(i) != t2.start(i) || t1.end(i) != t2.end(i)) {
        i = t1.length;
        return false;
      }
    }
  }

  return true;
}

/**
 * Class SubtitlesButton
 * @extends ToggleButton
 * 
 * @HTML :
    <div role="button" class="amst__subtitles" tabindex="0"><div class="amst__svg-background"></div></div>

    SUBTITLES PARAMETERS: 
    { 
      label: 
      { 
        on: 'Disable subtitles', 
        off: 'Enable subtitles' 
      }, 
      disabled: false, 
      hidden: false, 
      tooltip: 
      { 
        hidden: false, 
        position: 'left' 
      }, 
      state: false, 
      wrapper: '', 
      container: '', 
      sources: [], 
      default:'fr' 
    }

    Each WRAPPER and CONTAINER properties should be a valid selector referencing 
    the HTML elements where to display the subtitles.
    This block must be on the form :
      <block>
        <inline-block class="my-subtitles-wrapper">
          <inline class="my-subtitles-container">
            <!-- HERE COME THE SUBTITLES -->
          </inline>
        </inline-block>
      </block>
    The wrapper element gains the "amst__hide-subtitles" class when the subtitles button is off
    ands the "amst__subtitles-empty" class each time there is no subtitle to display.

    SOURCES property should be an array of object, each object referencing a subtitles track.
    sources =
    [
      {
        src: path to the subs file,
        srclang: language code (en-US, fr-FR, en, fr),
        label: language label displayed in the settings panel
      }
    ]

    DEFAULT property is the language code that should be used 
    if there is no track whose language corresponds to the navigator language

 */

var _init$1 = new WeakMap();

var _buildTextTracks = new WeakSet();

class SubtitlesButton extends ToggleButton {
  /**
   * PRIVATE
   * @private {Boolean} #init - Pass to true after the first #buildTextTracks() call
   */

  /**
  * INHERITED PROPERTIES
  * @property name - button name
  * @property player - player instance
  * @property params - button parameters
  * @property button - HTML button
  */

  /**
   * PROPERTIES
   * @property media
   * @property container - where to display subtitles
   * @property wrapper - wrapper containing container
   */

  /**
   * OVERRIDDEN GETTER/SETTER
   * @property {Boolean} state - get/set the Button state
   */

  /**
   * PRIVATE METHOD
   * @method #buildTextTracks()
   * @description : build the html track elements according to the subtitles parameters
   */

  /**
   * OVERRIDDEN METHODS
   * @method update()
   *  Called on amst__src-change event
   *    - hides the button if there is no textTrack
   *    - updates the button properties (label/disabled/hidden/tooltip)
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__subtitles-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__subtitles-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   */
  constructor(player, ui) {
    //Call the toggleButton constructor
    super('subtitles', player, ui);

    _buildTextTracks.add(this);

    _init$1.set(this, {
      writable: true,
      value: false
    });

    const _params = this.params,
          media = this.media = player.params.media;

    if (_params.sources.length == 0) {
      //No subtitles src in parameters
      //Retrieve the HTML subtitles tracks and build the params.sources array
      const subsSources = [],
            tracks = player.params.$$('track[src][srclang][label]', media);

      if (tracks.length > 0) {
        tracks.forEach(t => {
          subsSources.push({
            src: t.src,
            srclang: t.srclang,
            label: t.label
          });
          if (t.default && !_params.default) _params.default = t.srclang;
        });
      }

      _params.sources = subsSources;
    }

    player.on('amst__src-change', _ => _classPrivateMethodGet(this, _buildTextTracks, _buildTextTracks2).call(this));
    player.on('amst__subtitles-click', _ => this.state = !this.state);
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                               PRIVATE METHOD                               */

  /* -------------------------------------------------------------------------- */

  /**
   * @method #buildTextTracks()
   * @description : build the html track elements according to the subtitles parameters
   */


  /* -------------------------------------------------------------------------- */

  /*                             STATE GETTER/SETTER                            */

  /* -------------------------------------------------------------------------- */

  /**
   * @getter
   * @return {Boolean}
   * @description : Return the button state
   */
  get state() {
    return super.state;
  }
  /**
   * @setter
   * @param {Boolean} state
   * @description : Set the button state - hides/shows the subtitles
   *    
   */


  set state(state) {
    state = state && !this.params.hidden;

    if (this.wrapper) {
      if (state) {
        //Show subs
        this.wrapper.classList.remove('amst__hide-subtitles');
      } else {
        //Hide subs
        this.wrapper.classList.add('amst__hide-subtitles');
      }
    } //The super.state setter call the update method


    super.state = this.params.state = state;
  }
  /* -------------------------------------------------------------------------- */

  /*                                   METHODS                                  */

  /* -------------------------------------------------------------------------- */

  /**
   * @method update()
   * @description : 
   *    - set the wrapper and container instance properties
   *    - hides the button if there is no textTrack or no wrapper or no container
   *    - updates the button properties (label/disabled/hidden/tooltip)
   */


  update() {
    this.wrapper = null;
    this.container = null;
    const params = this.params;

    try {
      this.wrapper = document.querySelector(params.wrapper);
      this.container = document.querySelector(params.container);
    } catch (e) {
      try {
        this.wrapper = this.player.params.$('.amst__subtitles-wrapper');
        this.container = this.player.params.$('.amst__subtitles-container');
      } catch (e) {}
    } //Hides the button if there is no textTrack


    params.hidden = params.hidden || params.sources.length == 0 || this.wrapper == null || this.container == null; //The button's state parameter is forced to false if there is no subtitles tracks

    this.state = params.state;
    super.update();
  }

}
/* -------------------------------------------------------------------------- */

/*                              UTILITY FUNCTIONS                             */

/* -------------------------------------------------------------------------- */

/**
 * @method isString()
 * @param {string} str
 * @description return true if str is a string and not empty
 */

var _buildTextTracks2 = function _buildTextTracks2() {
  if (_classPrivateFieldGet(this, _init$1) && this.params.sources.length == 0) {
    this.player.params.$$('track[kind="subtitles"]').forEach(t => t.remove());
  }

  if (this.params.sources.length == 0 || !this.wrapper || !this.container) return;
  const params = this.params; //Sort the sources according to the srclang key alphabetical order

  sortArray(params.sources);
  let html = ''; //Retain only the sources with src, srclang and label properties and write the html

  params.sources.filter(s => isString(s.src) && isString(s.srclang) && isString(s.label)).forEach(s => {
    html += `<track kind="subtitles" src="${s.src}" srclang="${s.srclang}" label="${s.label}" type="text/vtt">`;
  }); //Insert the result

  this.media.innerHTML = html;
  this.wrapper.classList.add('amst__subtitles-empty');
  let activeTrack = null;
  const textTracks = this.media.textTracks;

  for (let i = 0; i < textTracks.length; i++) {
    const t = textTracks[i];
    t.mode = 'disabled';
    t.addEventListener("cuechange", _ => {
      this.container.innerHTML = '';
      if (t.activeCues.length > 0) this.container.appendChild(t.activeCues[0].getCueAsHTML());

      if (this.container.innerHTML == '') {
        this.wrapper.classList.add('amst__subtitles-empty');
      } else {
        this.wrapper.classList.remove('amst__subtitles-empty');
      }
    }); //Set the default track according to navigator language

    if (t.language == window.navigator.language || t.language.split('-')[0] == window.navigator.language.split('-')[0]) {
      activeTrack = t;
    }
  } //If there is no track with navigator language, search a track 
  //whose language corresponds to that given by the default parameter.


  if (!activeTrack) {
    for (let i = 0; i < textTracks.length; i++) {
      const t = textTracks[i];

      if (t.language == params.default || t.language.split('-')[0] == params.default.split('-')[0]) {
        activeTrack = t;
      }
    }
  } //If still no corresponding track found, set the first track active


  if (!activeTrack) activeTrack = textTracks[0];
  activeTrack.mode = 'hidden';

  _classPrivateFieldSet(this, _init$1, true);
};

function isString(str) {
  return typeof str === 'string' && str != '';
}
/**
 * @method sortArray()
 * @param {Array} arr
 * @param {string} key
 * @description sort arr by key alphabetically
 */


function sortArray(arr, key = 'label') {
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const valA = a[key].toUpperCase();
    const valB = b[key].toUpperCase();
    let comparison = 0;

    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }

    return comparison;
  }

  try {
    return arr.sort(compare);
  } catch (e) {
    return arr;
  } //return arr.sort(compare)

}

/**
 * Class SettingsButton.
 * @extends Button
 */

var _state = new WeakMap();

class SettingsButton extends Button {
  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * PROPERTIES
   * @property nodal - nodal wrapper
   * @property settingsContainer
   */

  /**
   * @private {Boolean} #state
   * @description : Stores the settings display visibility
   */

  /**
   * GETTER
   * @property {Boolean} state - true if settings are visible, false if not
   */

  /**
   * OVERRIDDEN METHODS
   * @method update() : updates the hidden button property and the available settings
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__settings-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__settings-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   * @description : The settings are listed in a <ul> (settingsContainer) wrapped in a <div> (settingsWrapper).
   * 
   * On screens whose width and height are greater than 720px :
   *    - The wrapper is located above the button. 
   *        If the available space above the button is too small to contain the wrapper, 
   *        the wrapper is positioned under the button by the amst__align-bottom class.
   *        Available space above the button is calculated on window's resize event.
   *    - If mouse is used, the wrapper is shown when hovering the settings button and hidden when leaving.
   *    - If pointer is not mouse : 
   *          A tap on the settings button shows/hides the wrapper.
   *          If the wrapper is visible, a tap anywhere outside the container hides the wrapper.
   * 
   * On screens whose width or height are less than 720px : 
   *    The settings are displayed in the nodal window.
   *    The nodal window closes when a click occurs outside the settings container.
   * 
   */
  constructor(player, ui) {
    super('settings', player, ui);
    /*Insert the settings-display container which contains 
      a div for the close button (only visible on touch screens)
      and a <ul> for :
      SPEED
      QUALITY
      SUBTITLES
    */

    _state.set(this, {
      writable: true,
      value: false
    });

    this.button.insertAdjacentHTML('beforeend', `<div class="amst__settings-display"><div></div><ul></ul></div>`);
    const button = this.button,
          settingsWrapper = button.querySelector('.amst__settings-display'),
          $ = player.params.$,
          //Nodal window contents the settings container when screen width or height is less than 720px
    nodal = this.nodal = player.params.nodal,
          self = this;
    this.settingsContainer = settingsWrapper.querySelector('ul');
    /*
      If the mouse is used, hovering the button shows the settings panel (via CSS).
      If not, a pointerdown event on button shows/hides the settings panel
    */
    //For pointers other than mouse :

    button.querySelector('.amst__svg-background').addEventListener(player.params.pointerup, _ => {
      if (player.params.currentPointerType == 'mouse') return;
      this.state ? hide() : show();
    });
    /**
     * @function hide()
     * @description hides the settings panel
     */

    function hide() {
      //Hides and reset the nodal window
      nodal.hide(); //Remove event listeners

      nodal.container.removeEventListener('click', onNodalClick);
      window.removeEventListener('click', onWindowClick); //Reset the button

      button.classList.remove('amst__on'); //Hides the settings-display wrapper

      _classPrivateFieldSet(self, _state, false);
    }
    /**
     * @function show()
     * @description shows the settings panel
     * Only called by pointerdown event on button if currentPointerType is not mouse
     */


    function show() {
      if (window.innerWidth <= 720 || window.innerHeight <= 720) {
        //Show nodal
        nodal.show('<ul>' + self.settingsContainer.innerHTML + '</ul>'); //Listens to click event on nodal to hide it
        //setTimeout otherwise nodal container will receive the click event and trigger the hide method

        setTimeout(_ => nodal.container.addEventListener('click', onNodalClick), 50);
      } else {
        //Listens to click event on window to hide settings panel
        setTimeout(_ => window.addEventListener('click', onWindowClick), 50);
      }

      button.classList.add('amst__on'); //Shows the settings-display wrapper

      _classPrivateFieldSet(self, _state, true);
    }
    /**
     * @function onWindowClick()
     * @description Listens to click event on window as long as the settingsWrapper is shown
     * If the click occurs outside the settingsContainer, the settingsWrapper is hidden 
     */


    function onWindowClick(e) {
      //Ignore the event if the target belongs to the settingsContainer
      let el = e.target;

      while (el = el.parentNode) {
        if (el == self.settingsContainer) return;
      } //If the click occurs outside the settingsContainer, hides the settingsWrapper


      hide();
    }
    /**
     * @function onNodalClick()
     * @description Listens to click event on nodal.
     * If the click occurs outside the settings container, the nodal is hidden 
     */


    function onNodalClick(e) {
      //e.currentTarget is nodal by definition.
      //if e.target == e.currentTarget, the click has occurred outside the settings container
      if (e.target == e.currentTarget) hide(); //If the click occurs on a line not marked as selected, call the change function

      if (e.target.hasAttribute('data-setting') && !e.target.classList.contains('amst__selected')) change(e);
    }

    this.settingsContainer.addEventListener('click', e => {
      //If the click occurs on a line not marked as selected, call the change function
      if (e.target.hasAttribute('data-setting') && !e.target.classList.contains('amst__selected')) change(e);
    });
    /**
     * @function change()
     * @param {event} e - needed to get the target properties
     * @description applies the change
     */

    function change(e) {
      const setting = e.target.getAttribute('data-setting'),
            value = e.target.getAttribute('data-value'),
            media = player.params.media,
            oldLine = $(`li[data-setting="${setting}"].amst__selected`),
            oldValue = setting == 'quality' ? oldLine.innerHTML : oldLine.getAttribute('data-value'),
            newLine = $(`li[data-value="${value}"]`),
            newValue = setting == 'quality' ? newLine.innerHTML : value; //reset selected

      $(`li[data-setting="${setting}"].amst__selected`).classList.remove('amst__selected'); //Set new selected

      $(`li[data-value="${value}"]`).classList.add('amst__selected'); //Update nodal content if it's visible

      if (nodal.visible) nodal.show('<ul>' + self.settingsContainer.innerHTML + '</ul>'); //Change playbackRate

      if (setting == 'playbackRate') {
        media.playbackRate = parseFloat(value);
        player.emit('amst__playbackRate-change', oldValue, newValue);
        player.emit('amst__settings-change', 'playbackRate', oldValue, newValue);
      } //Change quality


      if (setting == 'quality') {
        const quality = e.target.textContent,
              s = window.sessionStorage,
              type = player.params.type,
              currentTime = media.currentTime,
              playbackRate = media.playbackRate,
              isPlaying = !player.paused,
              readyState = media.readyState > 0; //Metadata loaded
        //Update default quality in sessionStorage

        if (quality != s.getItem(`amst__${type}DefaultQuality`)) s.setItem(`amst__${type}DefaultQuality`, quality);
        if (isPlaying) media.pause(); //Updates media source

        media.src = value;
        if (readyState) media.load(); //Restores currentTime and playbackRate

        media.on('loadeddata', function restoreCurrentTime() {
          media.off('loadeddata', restoreCurrentTime);
          media.currentTime = currentTime;
        });
        media.playbackRate = playbackRate;
        player.emit('amst__quality-change', oldValue, newValue);
        player.emit('amst__settings-change', setting, oldValue, newValue);
        if (isPlaying) media.play();
      } //Change subs


      if (setting == 'subs') {
        for (let i = 0; i < media.textTracks.length; i++) {
          media.textTracks[i].mode = media.textTracks[i].language == value ? 'hidden' : 'disabled'; //Displays the subtitles

          player.subtitles = {
            state: true
          };
        }

        player.emit('amst__subs-change', oldValue, newValue);
        player.emit('amst__settings-change', setting, oldValue, newValue);
      } //Force the button to loose the focus.
      //Otherwise, the settings will not be hidden when mouse leaves


      self.button.blur();
    }

    player.on('amst__src-change', hide) //Hides the settings when source changes
    .on('amst__resize', resize);
    /**
     * @function resize()
     * @description if there is not enough space available above the button,
     * the wrapper is positioned under.
     */

    function resize() {
      const rectTop = button.getBoundingClientRect().top,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (rectTop + scrollTop < 350) {
        settingsWrapper.classList.add('amst__align-bottom');
      } else {
        settingsWrapper.classList.remove('amst__align-bottom');
      }
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   GETTER                                   */

  /* -------------------------------------------------------------------------- */

  /**
   * @get state()
   * @return {Boolean} true if the settings panel is visible, false if not
   */


  get state() {
    return _classPrivateFieldGet(this, _state);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END GETTER                                 */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHOD                                   */

  /* -------------------------------------------------------------------------- */

  /**
   * @method update()
   * @description : updates the hidden button property and the list of available settings
   */


  update() {
    super.update();
    const params = this.params,
          media = this.player.params.media; //Reset the settingsContainer content

    this.settingsContainer.innerHTML = '';

    if (!params.hidden) {
      let listHTML = '',
          //Keep only the sources that have a quality property
      sources = this.player.params.src.filter(el => el.quality);
      /**
       * SPEED
       */

      if (params.playbackRates.length > 0) {
        /*
          Each element of the playbackRates array is either an array or a number.
          First element of the children arrays is a string used as label for the value given by the second element.
          If only a number is provided, label and value are equals. 
          playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]]
          listHTML = 
            <li>
              <span>PLAYBACK SPEED</span>
              <ul>
                <li data-setting="playbackRate" data-value="0.25">0.25 x</li>
                <li data-setting="playbackRate" data-value="0.5">0.5 x</li>
                <li data-setting="playbackRate" data-value="0.75">0.75 x</li>
                <li data-setting="playbackRate" data-value="1" class="amst__selected">Normal</li>
                <li data-setting="playbackRate" data-value="1.5">1.5 x</li>
                <li data-setting="playbackRate" data-value="2">2 x</li>
                <li data-setting="playbackRate" data-value="4">4 x</li>
              </ul>
            </li>
        */
        listHTML = `
          <li>
            <span>${params.playbackRatesLabel}</span>
            <ul>
          `;
        params.playbackRates.forEach(el => {
          el = Array.isArray(el) ? el : [el, parseFloat(el)];
          const selected = el[1] == this.player.params.playbackRate ? ' class="amst__selected"' : '';
          listHTML += `<li data-setting="playbackRate" data-value="${el[1]}"${selected}>${el[0]}</li>`;
        });
        listHTML += '</ul></li>';
      }
      /**
       * QUALITY
       */


      if (sources.length > 1) {
        /*
          listHTML = 
            <li>
              <span>QUALITY</span>
              <ul>
                <li data-setting="quality" data-value="path_to_360p.mp4">360p</li>
                <li data-setting="quality" data-value="path_to_480p.mp4">480p</li>
                <li data-setting="quality" data-value="path_to_720p.mp4" class="amst__selected">720p</li>
                <li data-setting="quality" data-value="path_to_1080p.mp4">1080p</li>
              </ul>
            </li>
        */
        listHTML += `
          <li>
            <span>${params.qualityLabel}</span>
            <ul>
          `;
        sources.forEach(el => {
          const id = media.src.lastIndexOf(el.src),
                selected = id >= 0 && media.src.substring(0, id) + el.src == media.src ? ' class="amst__selected"' : '';
          listHTML += `<li data-setting="quality" data-value="${el.src}"${selected}>${el.quality}</li>`;
        });
        listHTML += '</ul></li>';
      }
      /**
       * SUBTITLES
       */


      if (media.textTracks.length > 1) {
        /*
          listHTML = 
            <li>
              <span>SUBTITLES</span>
              <ul>
                <li data-setting="subs" data-value="en">English</li>
                <li data-setting="subs" data-value="fr">Français</li>
              </ul>
            </li>
        */
        listHTML += `
          <li>
            <span>${params.subsLabel}</span>
            <ul>
          `;

        for (let i = 0; i < media.textTracks.length; i++) {
          const t = media.textTracks[i],
                selected = t.mode == 'hidden' ? ' class="amst__selected"' : '';
          listHTML += `<li data-setting="subs" data-value="${t.language}"${selected}>${t.label}</li>`;
        }

        listHTML += '</ul></li>';
      }

      this.settingsContainer.innerHTML = listHTML;

      if (this.settingsContainer.childNodes.length == 0) {
        this.button.classList.add('amst__hidden');
      }
    }

    this.player.emit('amst__should-resize');
  }

}

//cSpell:words amstramgram amst beforeend
/* -------------------------------------------------------------------------- */

/*                                    UTILS                                   */

/* -------------------------------------------------------------------------- */
//Throttle the resize event

throttle('resize scroll', 'amst__optimizedScrollResize');
/*
  WIDTH CALCULATION OF THE TIMING DISPLAY ELEMENTS
  Those widths depend of the browser and must be defined
  to get the exact position ot the elements.
  Wa measure those widths for durations :
  - inferior to one hour (displayed duration : 00:00).
  - superior or equal to one hour (displayed duration : 00:00:00).
*/

const w$2 = window,
      d$1 = document,
      s$3 = w$2.sessionStorage;
let timeWidth, //Width for durations inferior to one hour.
longTimeWidth; //Width for durations superior or equal to one hour.

if (s$3.getItem('amst__timeWidth')) {
  //If sessionStorage is available and data already stored :
  timeWidth = s$3.getItem('amst__timeWidth');
  longTimeWidth = s$3.getItem('amst__longTimeWidth');
} else {
  const measureTime = d$1.createElement('div'),
        measureLongTime = d$1.createElement('div'); //amst__measureTime class is identical to amst__time class
  //but set an absolute position.

  measureTime.classList.add('amst__measureTime');
  measureTime.innerHTML = '<span>00:00<span>';
  measureLongTime.classList.add('amst__measureTime');
  measureLongTime.innerHTML = '<span>00:00:00<span>';
  d$1.body.appendChild(measureTime);
  d$1.body.appendChild(measureLongTime);
  timeWidth = measureTime.offsetWidth + 2;
  longTimeWidth = measureLongTime.offsetWidth + 2;
  d$1.body.removeChild(measureTime);
  d$1.body.removeChild(measureLongTime);
  s$3.setItem('amst__timeWidth', timeWidth);
  s$3.setItem('amst__longTimeWidth', longTimeWidth);
} //Resulting rules are inserted in the DOM


const style = d$1.createElement("style"); // WebKit hack

style.appendChild(d$1.createTextNode(""));
d$1.head.appendChild(style);
style.sheet.insertRule(`.amst__time>span{width:${timeWidth}px;`, 0);
style.sheet.insertRule(`.amst__time.amst__long>span{width:${longTimeWidth}px;`, 0); //END WIDTH CALCULATION OF THE TIMING DISPLAY ELEMENTS

/* -------------------------------------------------------------------------- */

/*                                  END UTILS                                 */

/* -------------------------------------------------------------------------- */

/**
 * Class AudioUI.
 * @description Create the UI for AmstramgramAudioPlayer
 */

class AudioUI {
  /**
   * PROPERTIES
   * @property player - AmstramgramAudioPlayer or AmstramgramVideoPlayer instance passed as parameter
   * @property timeSlider - player instance
   * @property settingsButton - button parameters
   * @property boundingRect - container.getBoundingClientRect()
   */

  /**
   * METHOD
   * @method reset() : reset the player
   * called on amst__src-change and amst__${name}-should-update events
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player
   */
  constructor(player) {
    const self = this,
          params = player.params,
          $ = params.$,
          $$ = params.$$,
          media = params.media,
          container = $('.amst__container'),
          controls = $(d$1.createElement('div'));
    this.player = player;
    /* -------------------------------------------------------------------------- */

    /*                               BUILDING THE UI                              */

    /* -------------------------------------------------------------------------- */
    //Previous button

    new Button('previous', player, controls); //PlayPauseButton button

    const playPauseButton = new ToggleButton('playPause', player, controls); //Play button click event

    player.on('amst__playPause-click', button => button.state ? player.pause() : player.play()); //Next button

    new Button('next', player, controls); //TimeSlider
    //Property so we can listen to its 'amst__move-over-time-slider' event in the inherited class videoUI

    this.timeSlider = new TimeSlider(player, controls); //Mute/Volume

    if (params.isMobile) new MuteButton(player, controls);else {
      new VolumeButton(player, controls);
    }
    /**
     * Adding a wrapper for additional controls.
     * It contains the subtitles button, the settings button and the download button.
     * In videoUI, it also contains the PIP button.
     * If the player width is less than the miniMaxWidth parameter and 
     * if the wrapper contains more than one visible button,
     * the latter is replaced by a "more" toggle button.
     */

    const additionalControls = $(d$1.createElement('div'));
    additionalControls.classList.add('amst__additional-controls'); //Subtitles button

    new SubtitlesButton(player, additionalControls); //Settings button
    //this because we need to know its state in videoUI :
    //Controls should remain visible as long as its state is on

    this.settingsButton = new SettingsButton(player, additionalControls); //Download button

    new Button('download', player, additionalControls);
    player.on('amst__download-click', b => {
      if (!b.params.disabled) {
        const a = d$1.createElement('a');
        a.href = media.src;
        a.download = decodeURI(media.src.substring(media.src.lastIndexOf('/') + 1));
        d$1.body.appendChild(a);
        a.click();
        d$1.body.removeChild(a);
      }
    }); //Appending additionalControls

    controls.appendChild(additionalControls); //More button

    new ToggleButton('more', player, controls, '');
    player.on('amst__more-click', b => {
      b.state = !b.state;

      if (b.state) {
        $().classList.add('amst__show-additional-controls');
      } else {
        $().classList.remove('amst__show-additional-controls');
      }
    }); //Appending controls

    controls.classList.add('amst__controls');
    container.appendChild(controls); //Alert container.
    //Displays the message defined by the errorMessage parameter
    //if the media source is not found.

    container.insertAdjacentHTML('beforeend', `<div class="amst__error"><p>${params.errorMessage}</p></div>`);
    /**
     * Context menu is just a link showed on contextmenu event 
     * and then hidden when a click occurs outside it.
     * Since we don't like when things are too simple, we setup a small animation on the reveal.
     * This animation is done through a combination ot turbulence and displacementMap svg filters.
     * We play with the turbulence vertical baseFrequency parameter 
     * which is decreased from 0.3 (distortion) to 0 (flat).
     */

    container.insertAdjacentHTML('beforeend', `<div class="amst__contextmenu"><a href="http://onfaitdessites.fr" target="_blank">AmstramgramMediaPlayer<br>by onFaitDesSites</a></div>`);
    let animIsRunning = false,
        //setTimeout to clean the context menu style properties (position and filter) 
    //at the end of the opacity transition when it's hidden
    contextCleanStyleTimeout = null;
    $().on('contextmenu', e => {
      e.preventDefault(); //!e.offsetX means obsolete browsers

      if (!e.offsetX || animIsRunning) return;
      let r, //turbulence vertical baseFrequency parameter
      now; //timing reference to force a minimal 40ms interval between two calls to animationFrame

      if (!animIsRunning) {
        animIsRunning = true;
        r = 0.3;
        now = Date.now(); //the context menu position is set according to the event position

        const rect = self.boundingRect,
              width = rect.width,
              height = rect.height,
              x = e.clientX || e.pageX - window.pageXOffset,
              y = e.clientY || e.pageY - window.pageYOffset,
              left = x - rect.left < 0.5 * width ? x - rect.left + 5 + 'px' : 'unset',
              right = x - rect.left < 0.5 * width ? 'unset' : rect.right - x + 5 + 'px',
              top = y - rect.top < 0.5 * height ? y - rect.top + 10 + 'px' : 'unset',
              bottom = y - rect.top < 0.5 * height ? 'unset' : rect.bottom - y + 10 + 'px',
              transform = 'none'; //If the player width is too small, context menu is horizontally centered

        if (width < 450) {
          left = '50%';
          transform = 'translateX(-50%)';
        } //Show the context menu in the right position


        $('.amst__contextmenu').css({
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          transform: transform
        }).classList.add('amst__contextmenu-show'); //If necessary, cancel the timeout

        if (contextCleanStyleTimeout) clearTimeout(contextCleanStyleTimeout); //Launch the animation

        w$2.requestAnimationFrame(anim);
      }

      function anim() {
        //If less than 40ms since the previous call : wait...
        if (Date.now() - now < 40) {
          w$2.requestAnimationFrame(anim);
          return;
        }

        now = Date.now();
        r = Math.max(0, r - 0.03);
        $('.amst__contextmenu').css({
          filter: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0 ${r}' result='N' numOctaves='2' /><feDisplacementMap in='SourceGraphic' in2='N' scale='100' xChannelSelector='R' yChannelSelector='R'></feDisplacementMap></filter></svg>#n")`
        });

        if (r > 0) {
          w$2.requestAnimationFrame(anim);
        } else {
          animIsRunning = false;
        }
      } //Wait for click, resize or scroll event to hide the context menu


      w$2.addEventListener('click', removeContext);
      player.on('amst__resize', removeContext);

      function removeContext() {
        w$2.removeEventListener('click', removeContext);
        player.off('amst__resize', removeContext);
        $('.amst__contextmenu').classList.remove('amst__contextmenu-show'); //Cleaning at the end of the opacity transition

        contextCleanStyleTimeout = setTimeout(() => {
          $('.amst__contextmenu').removeAttribute('style');
        }, 400);
      }
    });
    /* -------------------------------------------------------------------------- */

    /*                             END BUILDING THE UI                            */

    /* -------------------------------------------------------------------------- */
    //Set a keyboard event listener on the wrapper.
    //When keyboard is used, we add the amst__keyboard-active css class to the wrapper 
    //to applied the proper style to the focused control.
    //The class is removed as soon as we detect a relevant pointer event.

    $().on('keydown', e => {
      //Adding the css class
      $().classList.add('amst__keyboard-active'); //Watching pointer's event

      w$2.addEventListener(params.pointermove, setKeyboardIsInactive, false);
      w$2.addEventListener(params.pointerdown, setKeyboardIsInactive, false);

      function setKeyboardIsInactive() {
        //Removing the css class
        $().classList.remove('amst__keyboard-active'); //Stop watching pointer's event

        w$2.removeEventListener(params.pointermove, setKeyboardIsInactive);
        w$2.removeEventListener(params.pointerdown, setKeyboardIsInactive);
      }

      if (e.which == 32) {
        //Space bar
        e.preventDefault();
        playPauseButton.button.focus();
        player.toggle();
      }
    }); //Media events

    media.on('loadedmetadata', _ => $().classList.add('amst__loadedmetadata')).on('play playing seeked canplay', _ => $().classList.remove('amst__buffering')).on('seeking waiting loadeddata', _ => $().classList.add('amst__buffering')).on('error', _ => {
      if (media.networkState == 3) {
        //No HTMLMediaElement src found.
        player.pause();
        $().classList.remove('amst__buffering');
        $().classList.add('amst__show-error');
        player.emit('amst__error');
      }
    }); //Player events

    player.on('amst__src-change', _ => {
      $().classList.remove('amst__loadedmetadata');
      $().classList.remove('amst__show-error');
      resize();
    }).on('amst__should-play', _ => $().classList.add('amst__buffering')).on('amst__play amst__should-play', _ => playPauseButton.state = true).on('amst__pause', _ => playPauseButton.state = false).on('amst__should-reset', _ => this.reset());
    /* -------------------------------------------------------------------------- */

    /*                           SIZING THE CONTROLS BAR                          */

    /* -------------------------------------------------------------------------- */
    //Resize function adds/removes the amst_compact and amst__mini class
    //according to the player width and the compactMaxWidth and miniMaxWidth instance parameters

    function resize() {
      //For video, first call may return a null height
      if (container.getBoundingClientRect().height == 0) {
        setTimeout(resize, 1);
        return;
      }

      self.boundingRect = container.getBoundingClientRect();
      let playerWidth = self.boundingRect.width;

      if (playerWidth <= params.compactMaxWidth) {
        $().classList.add('amst__compact');

        if ( //the amst__mini class is added if the player width is less than the miniMaxWidth parameter
        playerWidth <= params.miniMaxWidth && //AND
        //if there is more than one visible button in the additional controls
        $$('.amst__additional-controls div[role=button]').length - $$('.amst__additional-controls div[role=button].amst__hidden').length > 1) {
          $().classList.add('amst__mini');
        } else {
          $().classList.remove('amst__mini');
        }
      } else {
        $().classList.remove('amst__mini');
        $().classList.remove('amst__compact');
      }

      player.emit('amst__resize');
    } //The 'amst__should-resize' event is dispatched by the buttons when their hidden parameter changes
    //We need to resize because the conditions for amst__mini class might have changed.
    //It's also dispatched after settings button has been updated.


    player.on('amst__should-resize', resize);
    w$2.addEventListener('amst__optimizedScrollResize', resize);
  }
  /**********
    METHOD
  ***********/

  /*
    Reset the player : 
      - Set the src to undefined
      - Set the preload attribute to 'none'
      - Set the autoplay attribute to false
      - Restore src and currentTime
    Most of mobile browsers don't like to load multiple media elements.
    The reset method is called on the last player used when another player starts.
    Extended by VideoUI.
  */


  reset() {
    const params = this.player.params,
          media = params.media,
          //Store the media currentTime
    //So, when the player starts again, the playback head is set to the right time
    resetTime = media.currentTime,
          //Store the media src
    currentSrc = media.src;
    params.$().classList.remove('amst__loadedmetadata');
    params.$().classList.remove('amst__buffering');
    media.src = '';
    media.preload = 'none';
    media.autoplay = false; //Force the media update. Loading of the original source is cancelled.

    media.load(); //Restore the original source without preload (IE will persist in preloading but who cares ???)

    media.src = currentSrc; //Set the currentTime.

    try {
      media.currentTime = resetTime; //IE will fail
    } catch (e) {
      //so...
      media.addEventListener('loadedmetadata', function restoreCurrentTime() {
        media.removeEventListener('loadedmetadata', restoreCurrentTime);
        media.currentTime = resetTime;
      });
    }

    this.player.emit('amst__reset');
  }

}

var _visible = new WeakMap();

//cSpell:words amst

/**
 * @class Nodal
 * @description Singleton 
 * Append a div <div class="amst__hidden" data-role="amst__nodal"></div> to the body
 * Called in audioUI
 * Used to display the available settings on screens whose width or height are less than 720px.
 */
class Nodal {
  /**
   * @private {Boolean} #visible - Stores the visible
   */

  /**
   * PROPERTIES
   * @property container - DIV container
   */

  /**
   * METHODS
   * @method show()
   * @param {String} html
   * @description : fills container with html parameter and shows the nodal
   * 
   * @method hide()
   * @description : empties container and hides the nodal
   */

  /**
   * GETTER
   * @get visible()
   * @return {Boolean} true if the nodal is visible, false if not
   */

  /* -------------------------------------------------------------------------- */

  /*                                 CONSTRUCTOR                                */

  /* -------------------------------------------------------------------------- */
  constructor() {
    _visible.set(this, {
      writable: true,
      value: false
    });

    //If first instantiation
    if (!Nodal.nodal) {
      this.container = document.createElement('div');
      this.container.classList.add('amst__hidden');
      this.container.setAttribute('data-role', 'amst__nodal');
      document.body.appendChild(this.container);
      Nodal.nodal = this;
    }

    return Nodal.nodal;
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHODS                                  */

  /* -------------------------------------------------------------------------- */

  /**
   * @method show()
   * @param {String} html
   * @description : fills container with html parameter and shows the nodal
   */


  show(html) {
    this.container.innerHTML = html;
    this.container.classList.remove('amst__hidden');
    document.body.classList.add('amst__overflow-hidden');

    _classPrivateFieldSet(this, _visible, true);
  }
  /**
   * @method hide()
   * @description : empties container and hides the nodal
   */


  hide() {
    this.container.innerHTML = '';
    this.container.classList.add('amst__hidden');
    document.body.classList.remove('amst__overflow-hidden');

    _classPrivateFieldSet(this, _visible, false);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END METHODS                                */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   GETTER                                   */

  /* -------------------------------------------------------------------------- */

  /**
   * @get visible()
   * @return {Boolean} true if the nodal is visible, false if not
   */


  get visible() {
    return _classPrivateFieldGet(this, _visible);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END GETTER                                 */

  /* -------------------------------------------------------------------------- */


} //Creating, freezing and exporting an unique instance


const nodal = new Nodal();
Object.freeze(nodal);

const w$1 = window,
      s$2 = w$1.sessionStorage,
      UA = w$1.navigator.userAgent.toLowerCase(),
      isIos = /ipad|iphone|ipod/i.test(UA) && !w$1.MSStream,
      isMobile = isIos || /android/i.test(UA),
      isIE = UA.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
/**
 * Class AmstramgramAudioPlayer.
 * @extends EventEmitter
 */

var _init = new WeakMap();

var _paused = new WeakMap();

class AmstramgramAudioPlayer extends EventEmitter {
  /* -------------------------------------------------------------------------- */

  /*                               INTERNAL UTILS                               */

  /* -------------------------------------------------------------------------- */

  /**
   * @getter booleanAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element boolean attributes 
   * that we have to treat on initialization.
   */
  static get booleanAttributes() {
    return ['autoplay', 'loop'];
  }
  /**
   * @getter stringAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element string attributes 
   * that we have to treat on initialization.
   */


  static get stringAttributes() {
    return ['crossOrigin', 'preload', 'type'];
  }
  /**
   * @getter attributesToUpdate
   * @returns {Array}
   * @description returns the list of the HTML audio element attributes 
   * that we have to update when src changes.
   */


  static get attributesToUpdate() {
    return ['crossOrigin', 'loop', 'preload', 'type'];
  }
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
    return Object.keys(this.srcOptions).filter(k => isObject(this.srcOptions[k]) && (this.srcOptions[k].hasOwnProperty('label') || this.srcOptions[k].hasOwnProperty('hidden')));
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


  /** 
   * @get instanceOptions
   * @returns {Object}
   * @description return the current options for new instances
  */
  static get instanceOptions() {
    return clone(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _instanceOptions$1));
  }
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


  /** 
   * @get srcOptions
   * @returns {Object}
   * @description return the current options for new audio src
  */
  static get srcOptions() {
    return clone(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _srcOptions$1));
  }
  /** 
   * @set options
   * @param {Object} opt
   * @description : set the default options of the class.
  */


  static set options(opt) {
    new Array(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _instanceOptions$1), _classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _srcOptions$1)).forEach(obj => {
      mergeDeep(obj, opt);
    });
  }
  /** 
   * @get options
   * @returns {Object}
   * @description : return the default options of the class.
  */


  static get options() {
    return { ...this.instanceOptions,
      ...this.srcOptions
    };
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END OPTIONS                                */

  /* -------------------------------------------------------------------------- */

  /**
   * @private #players
   * @type {Array}
   * @description store the audio player instances
   */


  /** 
   * @get players
   * @returns {Array}
   * @description : Returns a clone of the private field #players array.
  */
  static get players() {
    return [..._classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _players)];
  }
  /** 
   * @private #currentPlayer
   * @typeof {AmstramgramAudioPlayer} 
   */


  /** 
   * @get currentPlayer
   * @returns {AmstramgramAudioPlayer|undefined}
   * @description : Returns the current player or undefined if there is none.
  */
  static get currentPlayer() {
    return _classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _currentPlayer);
  }
  /* -------------------------------------------------------------------------- */

  /*                               PRIVATE FIELDS                               */

  /* -------------------------------------------------------------------------- */


  //Playing status

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
      callback = params;
      params = {};
    }

    super(); //If there is no media or if media is not an HTMLMediaElement, leaving...

    _init.set(this, {
      writable: true,
      value: false
    });

    _paused.set(this, {
      writable: true,
      value: true
    });

    if (!media || media.tagName != 'AUDIO' && media.tagName != 'VIDEO') return; //If WrappingClass is not provided, AmstramgramAudioPlayer is used as standalone 
    //and media must be an HTMLAudioElement. If not, leaving...
    else if (!WrappingClass && media.tagName != 'AUDIO') return; //If WrappingClass is provided but is not an AmstramgramMediaPlayer instance, leaving...
      else if (WrappingClass && WrappingClass.name != 'AmstramgramMediaPlayer') return; //If WrappingClass is provided but callback is not a function, leaving...
        else if (WrappingClass && (!callback || typeof callback != 'function')) return;
    const Class = this.constructor,
          //AmstramgramAudioPlayer or AmstramgramVideoPlayer
    //myParams stores the parameters of the instance
    //Initially, it's just a clone af the class options
    myParams = clone(Class.options); //Time to begin HTML construction common to audio and video

    const $ = _$(document.createElement('div')); //This is our wrapper


    _$$($()); //Wrapper classes


    let classes = `amst__wrapper`; //Special css class for IE11 to prevent some transition bugs

    if (window.document.documentMode) classes += ` amst__ie`; //See './tools/selector.js' for details and usage

    $().setAttributes({
      class: classes,
      'aria-label': `${myParams.appLabel}`,
      role: 'application'
    }).insertAdjacentHTML('beforeend', `
        <span class="amst__offscreen">${myParams.appLabel}</span>
        <div class="amst__container" tabindex="0">
          <div class="amst__mediaelement"></div>
        </div>
      `);
    media.parentNode.insertBefore($(), media); //Move the Html media element into the wrapper

    $('.amst__mediaelement').appendChild(media); //Add the HTML wrapper and media elements to the instance params object.

    myParams.$ = $;
    myParams.$$ = _$$($());
    myParams.media = $(media); //And some useful information

    myParams.isIos = isIos;
    myParams.isMobile = isMobile;
    myParams.isIE = isIE;
    myParams.type = Class == AmstramgramAudioPlayer ? 'audio' : 'video';
    /* -------------------------------------------------------------------------- */

    /*                        TREATING THE HTML ATTRIBUTES                        */

    /* -------------------------------------------------------------------------- */
    //First, we force the controls attribute to false

    media.controls = false;
    params = buildSrcParams(params, media, false); //If the muted attribute is set

    if (media.muted) {
      //if a valid volume has been passed in parameters, it overrides the muted attribute
      if (!isNaN(params.volume) && params.volume > 0 && params.volume <= 1) {
        media.muted = false; //If not, the volume property of the parameters is set to 0
      } else {
        params.volume = 0;
      } //Removing the HTML attribute


      media.removeAttribute('muted');
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
      params[a] = typeof params[a] === 'boolean' ? params[a] : media[a] == true ? true : undefined; //Removing attributes which don't need to be updated when src changes (autoplay).

      if (!Class.attributesToUpdate.includes(a)) media.removeAttribute(a);
    }); //Retrieving the string attributes

    Class.stringAttributes.forEach(a => {
      //Parameters overrides HTML attributes
      params[a] = typeof params[a] === 'string' ? params[a] : media.getAttribute(a); //Removing attributes which don't need to be updated when src changes (poster on video element).

      if (!Class.attributesToUpdate.includes(a)) media.removeAttribute(a);
    });
    /* -------------------------------------------------------------------------- */

    /*                      END TREATING THE HTML ATTRIBUTES                      */

    /* -------------------------------------------------------------------------- */
    //Updating default parameters with all the parameters of the instance 
    //(HTML attributes and constructor params arguments)

    mergeDeep(myParams, params);
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

    Object.assign(myParams, pointerDetector.data);
    myParams.currentPointerType = pointerDetector.currentPointerType; //nodal is used on small screens to display the settings

    myParams.nodal = nodal; //Sorting the parameters by alphabetical order to provide an easiest inspection

    const ordered = {};
    Object.keys(myParams).sort().forEach(function (key) {
      ordered[key] = myParams[key];
    });
    this.params = ordered;
    /* -------------------------------------------------------------------------- */

    /*                          POINTER EVENTS MANAGEMENT                         */

    /* -------------------------------------------------------------------------- */

    const self = this;

    if (pointerDetector.data.pointerEventsInterface == 'pointer') {
      function onPointerChange() {
        self.params.currentPointerType = pointerDetector.currentPointerType;

        if (pointerDetector.currentPointerType == 'mouse') {
          $().classList.add('amst__mouse');
        } else {
          $().classList.remove('amst__mouse');
        }
      }

      pointerDetector.on('amst__pointerChange', onPointerChange);
      onPointerChange();
    } else if (pointerDetector.pointerEventsInterface == 'mouse') $().classList.add('amst__mouse');
    /* -------------------------------------------------------------------------- */

    /*                        END POINTER EVENTS MANAGEMENT                       */

    /* -------------------------------------------------------------------------- */
    //Add the instance to the static players array of the AmstramgramAudioPlayer class


    _classStaticPrivateFieldSpecGet(AmstramgramAudioPlayer, AmstramgramAudioPlayer, _players).push(this); //And build the UI


    this._buildUI(); //Calling the setter src with the ordered parameters


    this.src = this.params;
    /** 
     *  AmstramgramAudioPlayer : 
     *    ["download", "next", "mute", "playPause", "previous"]
     *  AmstramgramVideoPlayer : 
     *    ["download", "next", "mute", "playPause", "previous", "fullscreen", "pip"]
    */

    this.constructor.buttons.forEach(k => {
      Object.defineProperty(this, k, {
        set: opt => {
          let o = {};
          o[k] = opt;
          mergeDeep(this.params, o);
          this.emit(`amst__${k}-should-update`);
        }
      });
    }); //Instance is initialized

    _classPrivateFieldSet(this, _init, true); //Calling the callback


    if (callback && typeof callback === "function") {
      setTimeout(_ => {
        callback.call(this);

        if (this.params.autoplay == true) {
          //Just to be sure that we let time to callback to execute
          setTimeout(_ => self.play(), 1);
        }
      }, 1);
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   PRIVATE                                  */

  /* -------------------------------------------------------------------------- */


  _buildUI() {
    if (this.constructor != AmstramgramAudioPlayer || this.init) return;
    new AudioUI(this);
    this.params.$().classList.add('amst__audio');
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
    return _classPrivateFieldGet(this, _init);
  }
  /** 
    @set currentTime
    @param {Number}
    @description set the media currentTime
  */


  set currentTime(t) {
    try {
      this.params.media.currentTime = t;
    } catch (e) {
      //IE11 throws an error if the media is not loaded
      console.warn(e);
    }
  }
  /** 
    @get currentTime
    @return {boolean}
    @description return the media currentTime
  */


  get currentTime() {
    return this.params.media.currentTime;
  }
  /** 
    @set muted
    @param {boolean}
    @description If true, mute the volume. If not, unmute the volume
  */


  set muted(bool) {
    if (typeof bool == 'boolean') this.params.media.muted = bool;
  }
  /** 
    @get muted
    @return {boolean}
    @description return true if the volume is muted, false if not
  */


  get muted() {
    return this.params.media.muted;
  }
  /** 
    @get paused
    @return {boolean}
    @description return true if the player is paused, false if not
  */


  get paused() {
    return _classPrivateFieldGet(this, _paused);
  }
  /** 
    @get playbackRate
    @return {number}
    @description return the media playbackRate
  */


  get playbackRate() {
    return this.params.media.playbackRate;
  }
  /** 
    @set playbackRate
    @param {number}
    @description set the media playbackRate
  */


  set playbackRate(rate) {
    this.params.media.playbackRate = rate;
  }
  /** 
    @get src
    @return {string}
    @description return the player src
  */


  get src() {
    return this.params.media.src;
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
    this.pause();
    const params = this.params,
          media = params.media,
          type = params.type;

    try {
      //IE will fail
      this.params.media.currentTime = 0;
    } catch (e) {} //Not needed on first call since src = this.params


    if (this.init) {
      src = buildSrcParams(src, media);
      const mySrc = this.constructor.srcOptions;
      mergeDeep(mySrc, src);
      mergeDeep(params, mySrc);
    } //Show the error message defined by the errorMessage instance option
    //if there is no valid src


    if (params.src.length == 0) {
      params.$().classList.add('amst__show-error');
      return;
    }
    /*
    Retrieving the right src
    rightSrc is either :
      - the first src of the src array for which quality is the same as that stored in sessionStorage
      - the first src of the src array with the default property set to true
      - the first src of the src array
    */
    //rightSrc is :


    let rightSrc = params.src.find(el => el.quality && el.quality == s$2.getItem(`amst__${type}DefaultQuality`)) || params.src.find(el => el.default == true) || params.src[0]; //Updating the defaultQuality stored in sessionStorage

    if (rightSrc.quality && rightSrc.quality != s$2.getItem(`amst__${type}DefaultQuality`)) {
      s$2.setItem(`amst__${type}DefaultQuality`, rightSrc.quality);
    } //Setting the type attribute


    if (rightSrc.type) {
      media.setAttribute('type', rightSrc.type);
    } else {
      media.removeAttribute('type');
    } //Setting the src


    media.src = rightSrc.src;
    media.playbackRate = params.playbackRate; //Setting the media properties
    //AmstramgramAudioPlayer.attributesToUpdate = ['crossOrigin', 'loop', 'preload']
    //AmstramgramVideoPlayer.attributesToUpdate = ["crossOrigin", "loop", "preload", "playsInline"]

    this.constructor.attributesToUpdate.forEach(a => {
      media[a] = params[a];
    });
    this.emit('amst__src-change');
    if (this.init && params.autoplay == true) this.play();
  }
  /** 
    @get volume
    @return {number}
    @description return the player volume
  */


  get volume() {
    return this.params.media.muted ? 0 : this.params.media.volume;
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
    if (isNaN(vol) || vol < 0 || vol > 1 || vol == this.volume || this.params.isMobile && vol != 0 && vol != 1) return;
    const params = this.params,
          media = params.media;

    if (vol > 0) {
      media.volume = vol;
      if (media.muted) media.muted = false;
    }

    if (vol == 0 && !media.muted) media.muted = true; //Send new volume to the players of the same volumeGroup

    AmstramgramAudioPlayer.players.filter(p => p != this && p.params.volumeGroup == params.volumeGroup && p.volume != vol).forEach(p => p.volume = vol);
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
    return;
  }
  /**
   * @method pause()
   * @description : pauses the player
   */


  pause() {
    if (!this.paused) {
      _classPrivateFieldSet(this, _paused, true);

      if (!this.params.media.paused) this.params.media.pause();
      this.emit('amst__pause');
    }
  }
  /**
   * @method play()
   * @description : Makes the player plays
   */


  play() {
    if (this.paused && this.src) {
      const self = this;

      if (this.params.media.paused) {
        if (AmstramgramAudioPlayer.currentPlayer && this != AmstramgramAudioPlayer.currentPlayer) {
          AmstramgramAudioPlayer.currentPlayer.pause();
          AmstramgramAudioPlayer.currentPlayer.emit('amst__should-reset');
        }

        _classPrivateFieldSet(this, _paused, false);

        this.emit('amst__should-play');
        const media = this.params.media;

        if (media.readyState == 0 && !isIE) {
          //Mainly for iOS
          //But IE will not dispatch the loadeddata event
          media.on('loadeddata', function onDataLoaded() {
            media.off('loadeddata', onDataLoaded);
            playIt();
          });
          media.load();
        } else playIt();

        function playIt() {
          const playPromise = media.play();

          if (playPromise !== undefined) {
            playPromise.then(playSucceed).catch(e => {
              self.emit('amst__pause');
            });
          } else {
            playSucceed();
          }
        }
      }

      function playSucceed() {
        self.emit('amst__play');

        _classStaticPrivateFieldSpecSet(AmstramgramAudioPlayer, AmstramgramAudioPlayer, _currentPlayer, self);
      }
    }
  }
  /**
   * @method showControls()
   * @description : Does nothing. Just here for compatibility with AmstramgramMediaPlayer API.
   */


  showControls() {
    return;
  }
  /**
   * @method toggle()
   * @description : Toggles the playback
   */


  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                             END PUBLIC METHODS                             */

  /* -------------------------------------------------------------------------- */


}
var _instanceOptions$1 = {
  writable: true,
  value: AudioDefaultOptions.instance
};
var _srcOptions$1 = {
  writable: true,
  value: AudioDefaultOptions.src
};
var _players = {
  writable: true,
  value: []
};
var _currentPlayer = {
  writable: true,
  value: undefined
};

//cSpell:words amstramgram oups
const instanceOptions = { ...AudioDefaultOptions.instance,
  appLabel: 'Video player',
  touchSeekingInfoText: 'Tap & go !'
},
      srcOptions = { ...AudioDefaultOptions.src,
  format: 16 / 9,
  fullscreen: {
    label: {
      on: 'Exit fullscreen',
      off: 'Fullscreen'
    },
    disabled: false,
    hidden: false,
    tooltip: {
      hidden: false,
      left: true
    }
  },
  playsInline: true,
  poster: '',
  thumbnails: {
    src: undefined,
    width: 120,
    int: 0
  }
};

if ('pictureInPictureEnabled' in document) {
  srcOptions.pip = {
    label: {
      on: 'Disable PIP',
      off: 'PIP'
    },
    disabled: false,
    hidden: false,
    tooltip: {
      hidden: false,
      left: true
    }
  };
}
/**
 * @class VideoDefaultOptions
 * @description Defines the default options of the AmstramgramVideoPlayer
 */


class VideoDefaultOptions {
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
    return { ...instanceOptions
    };
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
    return clone(srcOptions);
  }

}

//cSpell:words amstramgram amst tabindex enterpictureinpicture leavepictureinpicture
/**
 * Class PipButton.
 * @extends ToggleButton
 * 
 * @HTML :
 * <div role="button" class="amst__pip" tabindex="0"><div class="amst__svg-background"></div></div>
 */

class PipButton extends ToggleButton {
  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * INHERITED GETTER/SETTER
   * @property {Boolean} state - get/set the Button state
   */

  /**
   * OVERRIDDEN METHODS
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * according to the button state
   * AND
   * disabled the button if metadata have not yet been loaded
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__pip-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   */
  constructor(player, ui) {
    //Call the toggleButton constructor
    super('pip', player, ui);
    const media = player.params.media; //The button should be enabled only after metadata are loaded

    media.on('loadedmetadata', _ => {
      if (!this.params.disabled) this.button.removeAttribute('data-disabled');
    }).on('enterpictureinpicture', _ => this.state = true).on('leavepictureinpicture', _ => this.state = false);
    player.on('amst__src-change', _ => {
      if (this.state) exitPIP();
      setTimeout(_ => this.button.setAttribute('data-disabled', true), 1);
    }).on('amst__pip-click', b => {
      if (b.state) {
        //Exit PIP
        exitPIP();
      } else {
        //Enter PIP
        media.requestPictureInPicture().catch(_ => {});
      }
    });

    function exitPIP() {
      document.exitPictureInPicture().catch(_ => {});
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHOD                                   */

  /* -------------------------------------------------------------------------- */

  /**
   * @method update()
   * @description : updates the button properties (label/disabled/hidden/tooltip) 
   * according to the button state
   * AND
   * disabled the button if metadata have not yet been loaded
   */


  update() {
    super.update(); //The button is disabled if metadata have not yet been loaded

    if (!this.player.params.$().classList.contains('amst__loadedmetadata') && !this.params.disabled) this.button.setAttribute('data-disabled', true);
  }
  /* -------------------------------------------------------------------------- */

  /*                                 END METHOD                                 */

  /* -------------------------------------------------------------------------- */


}

const w = window,
      d = document,
      s$1 = w.sessionStorage;
let fullscreenAPI;

if (s$1 && s$1.getItem('amst_fullscreenAPI') != undefined) {
  fullscreenAPI = JSON.parse(s$1.getItem('amst_fullscreenAPI'));
} else {
  //https://github.com/sindresorhus/screenfull.js/
  //Prefix detection
  fullscreenAPI = function () {
    let val,
        fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenchange'], // New WebKit
    ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitfullscreenchange'], // Old WebKit (Safari 5.1)
    ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitfullscreenchange'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozfullscreenchange'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'MSFullscreenChange']],
        i = 0,
        l = fnMap.length,
        ret = {};

    for (; i < l; i++) {
      val = fnMap[i];

      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }

        return ret;
      }
    }

    return {
      fake: true
    }; //No Fullscreen API.
  }();

  if (s$1) s$1.setItem('amst_fullscreenAPI', JSON.stringify(fullscreenAPI));
}
/**
 * Class ToggleButton.
 * @extends ToggleButton
 * 
 * @HTML :
 * <div role="button" class="amst__fullscreen" tabindex="0"><div class="amst__svg-background"></div></div>
 */


var _isFullscreen = new WeakMap();

class FullscreenButton extends ToggleButton {
  /**
   * @private {Boolean} #isFullscreen - passed to true if the player is in fullscreen mode
   */

  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * INHERITED GETTER/SETTER
   * @property {Boolean} state - get/set the Button state
   */

  /**
   * INHERITED METHODS
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * according to the button state
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__fullscreen-click : dispatch on click - transmit the button
   * @event amst__name-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   */
  constructor(player, ui) {
    //Call the toggleButton constructor
    super('fullscreen', player, ui);

    _isFullscreen.set(this, {
      writable: true,
      value: false
    });

    const self = this,
          playerParams = player.params,
          $ = playerParams.$,
          container = $('.amst__container'),
          //When entering fullscreen, nodal container is moved inside the wrapper
    //On leaving, it is moved back to body
    //Nodal displays the available settings on small screens (width or height less than 720px)
    nodal = playerParams.nodal;
    /**
      * If fullscreen is not supported, 
      * we mimic it by giving to the player the amst__fake-fullscreen class :
      *    position: fixed;
      *    top: 0;
      *    left: 0;
      *    z-index: 1111111111111;
      * In fake mode (as in real mode), escape touch will exit the fullscreen
    */
    //Listen to the click event on the fullscreen button

    player.on('amst__fullscreen-click', _ => {
      if (this.state) {
        //Exit 
        if (fullscreenAPI.fake) {
          leaveFullscreen();
        } else {
          d[fullscreenAPI.exitFullscreen]();
        }
      } else {
        //Enter
        enterFullScreen();
      }
    }); //Variables used to store the window scroll position before entering fullscreen
    //so we can restore them when exiting fullscreen

    let scrollX = 0,
        scrollY = 0;

    function enterFullScreen() {
      scrollX = w.pageXOffset;
      scrollY = w.pageYOffset;

      if (fullscreenAPI.fake) {
        $().classList.add('amst__fake-fullscreen'); //Escape touch will exit the fullscreen

        w.addEventListener('keydown', windowOnKeydown);

        _classPrivateFieldSet(self, _isFullscreen, true);
      } else {
        $()[fullscreenAPI.requestFullscreen]();
      }

      d.body.classList.add('amst__overflow-hidden');
      $().appendChild(nodal.container);
      $().classList.add('amst__isfullscreen');
      self.state = true;
      resizeFullScreen();
      player.on('amst__resize', resizeFullScreen);
      player.emit('amst__should-resize');
      player.emit('amst__fullscreen-enter');
    }
    /**
     * Called :
     *   - in fake mode, when the fullscreen button is clicked 
     *        or when escape touch is pressed during fullscreen state;
     *   - in real mode, on fullscreenchange event.
     */


    function leaveFullscreen() {
      player.off('amst__resize', resizeFullScreen); //Reset the fullscreen button

      self.state = false; //Fake mode reset

      if (fullscreenAPI.fake) {
        $().classList.remove('amst__fake-fullscreen');
        w.removeEventListener('keydown', windowOnKeydown);
      } //Reset body, wrapper and container styles


      d.body.classList.remove('amst__overflow-hidden');
      container.setAttribute('style', `padding-bottom:${1 / playerParams.format * 100}%`);
      document.body.appendChild(nodal.container);
      $().classList.remove('amst__isfullscreen'); //Restore the scroll position and resize

      setTimeout(_ => {
        w.scroll(scrollX, scrollY);
        player.emit('amst__should-resize');
        player.emit('amst__fullscreen-exit');
      }, 50);
    } //Listen to fullscreenchange event 


    d.addEventListener(fullscreenAPI.fullscreenchange, _ => {
      if (_classPrivateFieldGet(this, _isFullscreen)) {
        //Exit
        //Reset the isFullscreen private property
        leaveFullscreen();

        _classPrivateFieldSet(this, _isFullscreen, false);
      } else if (d[fullscreenAPI.fullscreenElement] == $()) {
        //The instance is in fullscreen state
        //Set the isFullscreen private property
        _classPrivateFieldSet(this, _isFullscreen, true);
      }
    }); //Called from the resize function : when window resizes, when entering in fullscreen and when source changes

    function resizeFullScreen() {
      //If screen ratio device is larger than video ratio
      if (w.innerWidth / w.innerHeight > playerParams.format) {
        container.css({
          width: w.innerHeight * playerParams.format + 'px',
          height: '100%',
          'paddingBottom': 0
        }); //If screen ratio device is smaller than video ratio
      } else {
        container.css({
          width: '100%',
          height: 'auto',
          'paddingBottom': 1 / playerParams.format * 100 + '%'
        });
      }
    } //Used in fake mode to exit fullscreen state when escape touch is pressed


    function windowOnKeydown(e) {
      if (e.which != 27 || !fullscreenAPI.fake || !_classPrivateFieldGet(self, _isFullscreen)) return;
      leaveFullscreen();
    }
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */


}

const s = window.sessionStorage;
/**
 * Class VideoUI
 * @extends AudioUI
 * @description Create the Video UI by adding a collection of layers and a fullscreen button to the extended AudioUI
 * The layers :
 *  - poster : div whose background image points to the poster src. 
 *        It also includes a canvas element which is painted with the current 
 *        video frame when video is paused and another player starts.
 *  - loading : displays the big loading icon
 *  - play : displays the big play icon
 *  - subtitles : displays the subtitles
 *  - overlay : reacts to to pointer events (click and touchmove).
 * USAGE : 
 *  - a mouse click toggles the playback.
 * ON TOUCH DEVICES :
 *  - if the media is paused, a tap triggers the playback.
 *  - if the media is playing :
 *      - if controls are visible, a tap pauses the media.
 *      - if controls are hidden, a tap shows them.
 *  - an horizontal swipe displays the time indication corresponding to the finger location and the thumbnails if provided. 
 *        If a tap occurs just after the end of the swipe (400ms), the playback head is moved to the corresponding time.
 *        During the swipe, a message is displayed (default text : "Tap & go !", defined by the touchSeekingInfoText instance parameter).
 *        This message is removed for all players as soon as the user has tapped (this info is stored in local session storage).
 *  - during playback : 
 *        - a vertical up swipe displays the controls if they are hidden.
*         - a vertical down swipe hides the controls if they are displayed.
 */

class VideoUI extends AudioUI {
  /**
   * INHERITED PROPERTIES
   * @property player - AmstramgramAudioPlayer or AmstramgramVideoPlayer instance passed as parameter
   * @property timeSlider - player instance
   * @property settingsButton - button parameters
   * @property boundingRect - $('.amst__container').getBoundingClientRect()
   */

  /**
   * OVERRIDDEN METHOD
   * @method reset() : reset the player
   * called on amst__src-change and amst__${name}-should-update events
   */

  /** 
    @get showTouchSeekingInfo
    @returns {Boolean}
  */
  static get showTouchSeekingInfo() {
    return !s.hasOwnProperty('amst__hideTouchSeekingInfo');
  }
  /**
   * @function hideTouchSeekingInfo
   * @description called when the user has tapped after an horizontal touch swipe
   * Remove the touch seeking info in all video players
   */


  static hideTouchSeekingInfo() {
    if (s.hasOwnProperty('amst__hideTouchSeekingInfo')) return; //Store the value for future players

    s.setItem('amst__hideTouchSeekingInfo', 'true'); //Apply to all the already created video players

    this.videoUIs.forEach(ui => {
      const $ = ui.player.params.$;
      $('.amst__layer-overlay').removeChild($('.amst__layer-overlay .amst__seeking-touch-info'));
    });
  } //Private static array storing the VideoUI instances


  /** 
    @get videoUIs
    @returns {Array}
    @description :
      Returns a clone of the private field #videoUIs array.
  */
  static get videoUIs() {
    return [..._classStaticPrivateFieldSpecGet(this, VideoUI, _videoUIs)];
  }
  /**
   * CONSTRUCTOR
   * @param {AmstramgramVideoPlayer} player - AmstramgramVideoPlayer instance
   */


  constructor(player) {
    const params = player.params,
          media = params.media,
          $ = params.$,
          $$ = params.$$,
          container = $('.amst__container');
    /* -------------------------------------------------------------------------- */

    /*                             BUILDING THE LAYERS                            */

    /* -------------------------------------------------------------------------- */

    let layersHtml = `
      <div class="amst__layers">
        <div class="amst__layer-poster amst__hidden">
          <canvas></canvas>
        </div>
        <div class="amst__layer-loading amst__layer-scale">
          <div class="amst__loading">
            <span class="amst__svg"></span>
          </div>
        </div>
        <div class="amst__layer-play amst__layer-scale">
          <div class="amst__svg" role="button" tabindex="0" aria-label="${params.playPause.label.off}"></div>
        </div>
        <div class="amst__layer-subtitles">
          <div class="amst__subtitles-wrapper">
            <span class="amst__subtitles-container"></span>
          </div>
        </div>
        <div class="amst__layer-overlay">
      `;

    if (VideoUI.showTouchSeekingInfo === true) {
      layersHtml += `
          <div class="amst__seeking-touch-info">
            <span>${params.touchSeekingInfoText}</span>
          </div>
        `;
    }

    layersHtml += `   
          <div class="amst__seeking-touch-cover"></div>
          <div class="amst__seeking-touch-wrapper">
            <div class="amst__time amst__seeking">
              <span></span>
            </div>
          </div>
          <div class="amst__seeking-time-display-wrapper">
            <div class="amst__seeking-time-display"></div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', layersHtml);
    /* -------------------------------------------------------------------------- */

    /*                           END BUILDING THE LAYERS                          */

    /* -------------------------------------------------------------------------- */

    super(player);
    const d = document,
          layerPoster = $('.amst__layer-poster'),
          layerPosterCanvas = $('.amst__layer-poster canvas'),
          layerPlay = $('.amst__layer-play'),
          layerOverlay = $('.amst__layer-overlay'),
          seekingTouchCover = $('.amst__seeking-touch-cover'),
          seekingTouchWrapper = $('.amst__seeking-touch-wrapper'),
          controls = $('.amst__controls'),
          timeSlider = this.timeSlider,
          seekings = $$('.amst__seeking'),
          self = this; //PIP button if PIP is supported

    if ('pictureInPictureEnabled' in d) new PipButton(player, $('.amst__additional-controls')); //Fullscreen button

    new FullscreenButton(player, controls); //Mouse click on the overlay layer toggles the media playback.
    //If the pointer is not mouse and the controls are hidden (media is playing),
    //the first tap shows the controls. A second one pauses the media.
    //This behaviour is canceled when horizontal swipe is detected.

    layerOverlay.on('click', toggle);

    function toggle() {
      if (params.currentPointerType == 'mouse' || !controlsAreHidden) {
        player.toggle();
      } else {
        showControls();
      }
    } //Media events


    media.on('loadedmetadata', _ => {
      params.format = media.videoWidth / media.videoHeight;
      container.style.paddingBottom = 1 / params.format * 100 + '%';
      player.emit('amst__should-resize');
    }).on('seeked', () => {
      //The event is dispatched when media ended.
      //In this case, we display the poster.
      if (media.currentTime == 0 && media.paused) {
        layerPosterCanvas.width = 0;
        layerPosterCanvas.height = 0;
        layerPoster.classList.remove('amst__hidden');
        media.on('timeupdate', function hidePoster() {
          media.off('timeupdate', hidePoster);
          layerPoster.classList.add('amst__hidden');
        }); //If seeking is caused by horizontal swipe
      } else if (params.currentPointerType != 'mouse') hideControls(true);
    }).on('playing volumechange', () => {
      if (params.currentPointerType != 'mouse') hideControls(true);
    }); //Player events

    player.on('amst__play amst__should-play', _ => {
      layerPlay.classList.add('amst__hidden');
      layerPoster.classList.add('amst__hidden');
      if (!controlsAreHidden) hideControls(true);
    }).on('amst__pause', _ => {
      layerPlay.classList.remove('amst__hidden');
      showControls();
    }).on('amst__focus amst__showControls', showControls).on('amst__hideControls', hideControls).on('amst__resize', resize);
    /****************************************
    * 
    *                  RESIZE
    * 
    *****************************************/
    //The function is also called after source changed and when entering in fullscreen

    let playerWidth; //Needed for the thumbnail position on touch device

    function resize() {
      playerWidth = self.boundingRect.width; //Adapt the big play and loading svg elements scale 
      //so their dimension equals 1/3 of the player height/width.
      //Natural svg dimension is 90px

      let scale = Math.min(playerWidth, self.boundingRect.height) * 0.3 / 90; //scale must finally be constrained between 0.5 and 1

      scale = Math.max(0.4, Math.min(1, scale));

      if (scale == 1) {
        [...$$('.amst__layer-scale'), ...$$('.amst__layer-scale > div')].forEach(el => el.removeAttribute('style'));
      } else {
        $$('.amst__layer-scale').css({
          height: `calc(100% - ${controls.css('height')}px`
        });
        $$('.amst__layer-scale > div').css({
          transform: `scale(${scale})`
        });
      } //Sub font size adjustments


      let subFontSize = Math.round(24 * playerWidth / 1000);
      subFontSize = Math.min(Math.max(subFontSize, 14), 30) + 'px';
      $('.amst__subtitles-container').style.fontSize = subFontSize;
    }
    /* -------------------------------------------------------------------------- */

    /*                                 END RESIZE                                 */

    /* -------------------------------------------------------------------------- */

    /********************************************
    * 
    *                 SOURCE UPDATE
    *              POSTER & THUMBNAILS
    * 
    *********************************************/
    //Updating when source changes


    player.on('amst__src-change', _ => {
      //Updating the container viewport
      container.style.paddingBottom = 1 / params.format * 100 + '%'; //Updating the poster

      if (params.poster) {
        layerPoster.style.backgroundImage = `url("${params.poster}")`;
        layerPoster.classList.remove('amst__hidden');
      } else {
        layerPoster.removeAttribute('style');
        layerPoster.classList.add('amst__hidden');
      }

      const paramsThumbnails = params.thumbnails; //Updating the thumbnails

      if (paramsThumbnails.src && paramsThumbnails.width > 0 && paramsThumbnails.int > 0) {
        const thumbnailsImage = new Image();

        function onThumbLoad(e) {
          thumbnailsImage.removeEventListener('load', onThumbLoad);
          thumbnailsImage.removeEventListener('error', onThumbLoad);

          if (e.type == 'load' && e.target.getAttribute('src') == paramsThumbnails.src) {
            //In case of src changes before img loads
            //If the thumbnails src is valid
            //add the 'amst__thumbnails' class to the wrapper
            $().classList.add('amst__thumbnails'); //and define the style of the seeking container displaying the thumbnail

            const css = {
              width: `${paramsThumbnails.width}px`,
              height: `${thumbnailsImage.naturalHeight}px`,
              'background-image': `url("${paramsThumbnails.src}")`
            };
            seekings.css(css); //Listening to the 'amst__move-over-time-slider' event to update the thumbnail displayed on pointer move events
            //No need to worry whether the listener is already set
            //By construction, the eventEmitter class prevents multiple identical callbacks

            timeSlider.on('amst__move-over-time-slider', updateThumbnails);
          } else {
            //If the thumbnails src is not valid
            removeThumbnails();
          }
        }

        thumbnailsImage.addEventListener('error', onThumbLoad, false);
        thumbnailsImage.addEventListener('load', onThumbLoad, false);
        thumbnailsImage.src = paramsThumbnails.src;
      } else {
        removeThumbnails();
      }

      if (self.boundingRect) resize();
    });
    /**
     * @function updateThumbnails
     * @param {Number} ratio
     * @description : Update the thumbnail displayed on pointer move events (mousemove on time rail or touchmove on overlay layer)
     */

    function updateThumbnails(ratio) {
      const offset = params.thumbnails.width * Math.floor(ratio * media.duration / params.thumbnails.int);
      seekings.css({
        backgroundPositionX: -offset + 'px'
      });
    } //Cleaning if there is no thumbnails


    function removeThumbnails() {
      $().classList.remove('amst__thumbnails');
      timeSlider.off('amst__move-over-time-slider', updateThumbnails);
      seekings.forEach(el => el.removeAttribute('style'));
    }
    /***********************************************
    * 
    *                END SOURCE UPDATE
    * 
    * 
    * 
    * 
    *                HIDE/SHOW CONTROLS
    * 
    *************************************************/


    let hideControlsTimeOut = false,
        //timer set when the hideControls function needs to be delayed
    pointerOverControls = false,
        controlsAreHidden = false; //If no touch pointer is used, controls are shown when the pointer enters or moves on the player.
    //It the pointer is not over the controls, controls are then hidden after a delay given by the hideControlsDelay parameter.

    if (params.pointerEventsInterface != 'touch') {
      controls.on(params.pointerenter, _ => {
        if (params.currentPointerType == 'mouse') pointerOverControls = true;
      }).on(params.pointerleave, _ => {
        if (params.currentPointerType == 'mouse') {
          hideControls(true);
          pointerOverControls = false;
        }
      });
      layerOverlay.on(params.pointermove, _ => {
        if (params.currentPointerType == 'mouse') showControls();
      });
    } //Reset hideControlsTimeOut each time a pointerdown event is detected on controls


    controls.on(params.pointerdown, showControls);
    /**
     * @function hideControls
     * @description : internal method to hide the controls
     * @param {Boolean} delayed : if true, the controls will be hidden after the delay defined by the hideControlsDelay parameter
     * @param {Boolean} forced : if true, the controls are hidden even if the media is paused (only used during horizontal swipe on overlay)
     */

    function hideControls(delayed = false, forced = false) {
      if (media.paused && !forced) {
        //Controls remain always visible if the media is paused...
        //UNLESS PARAMETER forced IS TRUE.
        return;
      } else if (delayed || $().classList.contains('amst__buffering') || pointerOverControls || self.settingsButton.state //Controls should remain visible as long as settings button state is true
      ) {
          /*
            The delay is applied if the delayed parameter is set to true
            or if the media is buffering
            or if the pointer is over the controls
            or if the settings button state is on
          */
          //Reset timer
          if (hideControlsTimeOut) clearTimeout(hideControlsTimeOut);
          hideControlsTimeOut = setTimeout(hideControls, params.hideControlsDelay); //Only allow pan down : pan-up (scroll-down) will hide the controls

          layerOverlay.style.touchAction = 'pan-down';
        } else {
        //Hiding the controls
        if (hideControlsTimeOut) {
          clearTimeout(hideControlsTimeOut);
          hideControlsTimeOut = false;
        }

        $().off('keydown', hideControlsOnArrowDown).on('keydown', showControlsOnArrowUp).classList.add('amst__controls-hidden'); //Only allow pan up : pan-down (scroll-up) will show the controls

        layerOverlay.style.touchAction = 'pan-up';
        controlsAreHidden = true;
        player.emit('amst__controlsAreHidden');
      }
    }
    /**
     * @function showControls
     * @description : internal method to show the controls
     */


    function showControls() {
      if (hideControlsTimeOut) {
        clearTimeout(hideControlsTimeOut);
        hideControlsTimeOut = false;
      }

      $().on('keydown', hideControlsOnArrowDown).off('keydown', showControlsOnArrowUp).classList.remove('amst__controls-hidden');
      controlsAreHidden = false;
      player.emit('amst__controlsAreVisible');

      if (!media.paused) {
        hideControls(true);
      } else {
        //Allow scroll
        layerOverlay.style.touchAction = 'auto';
      }
    }
    /**
     * @function showControlsOnArrowUp()
     * @params {Keyboard event}
     * @description : shows the controls when Arrow Up key is pressed with shift key
     */


    function showControlsOnArrowUp(e) {
      if (e.which == 38 && e.shiftKey) showControls();
    }
    /**
     * @function hideControlsOnArrowDown()
     * @params {Keyboard event}
     * @description : hides the controls when Arrow Down key is pressed with shift key
     */


    function hideControlsOnArrowDown(e) {
      if (e.which == 40 && e.shiftKey) hideControls();
    }
    /**********************************************************************************************
    * 
    *                                   END HIDE/SHOW CONTROLS
    * 
    * 
    * 
    * 
    *                                    TOUCH EVENTS ON VIDEO
    * 
    * If we detect touch events :
    *   - A vertical up swipe shows the controls if they are hidden.
    *   - A vertical down swipe hides the controls it they are shown.
    *   - Horizontal swipes reveal the thumbnails
    *   - If a click is detected during a 400ms interval after the end of the horizontal swipe, 
    *       playback head is moved to the corresponding time.
    * 
    ***********************************************************************************************/


    if (params.pointerEventsInterface != 'mouse') {
      const threshold = 20; //Minimum distance for a swipe detection

      let touchStartX,
          //event abscissa
      touchStartY,
          //event ordinate
      seekingWidth,
          //Ratio between currentTime and duration when horizontal swipe is detected
      ratio,
          //value given to the seekingTouchCover scaleX 
      controlsWereHidden = false,
          //Were the controls hidden when horizontal swipe was detected ?
      tapAndGoTimer; //400ms timer set when horizontal swipe ends : if a click is detected during those 400ms, the media currentTime is updated

      layerOverlay.on('touchstart', e => {
        if (!media.duration || tapAndGoTimer) return;
        seekingWidth = seekingTouchWrapper.offsetWidth;
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        layerOverlay.on('touchend touchcancel', onTouchEnd);
        layerOverlay.on('touchmove', onTouchMove);
      });

      function onTouchMove(e) {
        const distX = Math.abs(e.changedTouches[0].clientX - touchStartX),
              distY = Math.abs(e.changedTouches[0].clientY - touchStartY),
              playerLeftPosition = self.boundingRect.left;

        if (distX > threshold && distY < 0.25 * distX || //Horizontal swipe detected
        ratio != undefined) {
          //Horizontal swipe in progress
          if (ratio == undefined) {
            //On horizontal swipe detection
            media.currentTime / media.duration; //Store the controls bar state to restore it at the end of the movement

            controlsWereHidden = controlsAreHidden; //Force the controls to be hidden if they are visible

            if (!controlsAreHidden) hideControls(false, true); //Show the layerOverlay children (seekingTouchCover and seekingTouchWrapper)

            layerOverlay.classList.add('amst__show');
          } //ratio calculation


          ratio = (e.changedTouches[0].clientX - playerLeftPosition) / playerWidth;
          ratio = Math.min(Math.max(ratio, 0), 1); //Update the cover

          seekingTouchCover.style.transform = `scaleX(${ratio})`; //Update time indicator

          $('.amst__seeking-touch-wrapper span').innerHTML = secondsToTimeCode(media.duration * ratio, params.hoursTimeDisplay || media.duration > 3600); //Update the wrapper position
          //We manage so the wrapper stays inside the player

          let translate = ratio * playerWidth - 0.5 * seekingWidth;
          translate = Math.max(0, Math.min(playerWidth - seekingWidth, translate));
          seekingTouchWrapper.style.transform = `translateX(${translate}px)`; //Update the thumbnail

          updateThumbnails(ratio);
        } else if (distY > threshold && distX < 0.25 * distY) {
          //Vertical swipe detected
          if (e.changedTouches[0].clientY > touchStartY) {
            if (!media.paused && !controlsAreHidden) hideControls();
          } else {
            if (controlsAreHidden) showControls();
          }
        }
      }

      function onTouchEnd(e) {
        layerOverlay.off('touchend touchcancel', onTouchEnd);
        layerOverlay.off('touchmove', onTouchMove);

        if (ratio != undefined) {
          //Ratio is defined only when horizontal swipe has occurred
          //Prevent toggle play on click
          layerOverlay.off('click', toggle); //Listen to the click event

          layerOverlay.on('click', onClick);

          function onClick() {
            //If click, set the playback head to the resulting time
            if (ratio != undefined) media.currentTime = media.duration * ratio; //Remove the touche seeking info

            if (VideoUI.showTouchSeekingInfo) VideoUI.hideTouchSeekingInfo(); //Restore original state

            clean();
          } //Set up the timer


          tapAndGoTimer = setTimeout(clean, 400);

          function clean() {
            //Cancel the timer
            clearTimeout(tapAndGoTimer); //Clear timer and ratio

            tapAndGoTimer = ratio = undefined; //remove the click listener, restore the toggle on click and hide the seeking elements

            layerOverlay.off('click', onClick).on('click', toggle).classList.remove('amst__show'); //If the controls were visible before the seeking, restore them; 

            if (!controlsWereHidden) showControls();
          }
        }
      }
    } //Update the touch seeking time indicator


    this.timeSlider.on('amst__time-slider-update', ratio => {
      $('.amst__seeking-time-display').style.transform = `scaleX(${ratio})`;
    });
    /*************************************************
    * 
    *             END TOUCH EVENTS ON VIDEO
    * 
    **************************************************/

    _classStaticPrivateFieldSpecGet(VideoUI, VideoUI, _videoUIs).push(this);
  }
  /****************************************************
  * 
  *                   END CONSTRUCTOR
  * 
  * 
  *                       METHOD
  * 
  ******************************************************/

  /*
    Extends the audioUI reset method.
    The caveat of resetting the media src is that the player displays a black screen.
    To avoid this, before resetting the source, we draw the current frame 
    in a canvas displayed in the poster layer.
    So the player just seems to be paused.
  */


  reset() {
    const media = this.player.params.media,
          layer = this.player.params.$('.amst__layer-poster'),
          canvas = this.player.params.$('.amst__layer-poster canvas'); //Set the canvas dimensions

    canvas.width = media.videoWidth;
    canvas.height = media.videoHeight; //Draw the current frame in the canvas

    canvas.getContext('2d').drawImage(media, 0, 0, canvas.width, canvas.height); //Display the poster layer. The poster image is hidden by the canvas.

    layer.classList.remove('amst__hidden');
    super.reset();
  }

}
var _videoUIs = {
  writable: true,
  value: []
};

class AmstramgramVideoPlayer extends AmstramgramAudioPlayer {
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
  static get booleanAttributes() {
    return [...AmstramgramAudioPlayer.booleanAttributes, 'playsInline'];
  }
  /**
   * @getter stringAttributes
   * @returns {Array}
   * @description returns the list of the HTML audio element string attributes 
   * that we have to treat on initialization.
   * ['crossOrigin', 'preload', 'poster']
   */


  static get stringAttributes() {
    return [...AmstramgramAudioPlayer.stringAttributes, 'poster'];
  }
  /**
   * @getter attributesToUpdate
   * @returns {Array}
   * @description returns the list of the HTML audio element attributes 
   * that we have to update when src changes.
   * ['crossOrigin', 'loop', 'preload', playsInline']
   */


  static get attributesToUpdate() {
    return [...AmstramgramAudioPlayer.attributesToUpdate, 'playsInline'];
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


  /** 
   * @get instanceOptions
   * @returns {Object}
   * @description return the current options for new instances
  */
  static get instanceOptions() {
    return clone(_classStaticPrivateFieldSpecGet(this, AmstramgramVideoPlayer, _instanceOptions));
  }
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


  /** 
   * @get srcOptions
   * @returns {Object}
   * @description return the current options for new video src
  */
  static get srcOptions() {
    return clone(_classStaticPrivateFieldSpecGet(this, AmstramgramVideoPlayer, _srcOptions));
  }
  /** 
   * @set options
   * @param {Object} opt
   * @description : set the default options of the class.
  */


  static set options(opt) {
    new Array(_classStaticPrivateFieldSpecGet(this, AmstramgramVideoPlayer, _instanceOptions), _classStaticPrivateFieldSpecGet(this, AmstramgramVideoPlayer, _srcOptions)).forEach(obj => {
      mergeDeep(obj, opt);
    });
  }
  /** 
   * @get options
   * @returns {Object}
   * @description : return the default options of the class.
  */


  static get options() {
    return { ...this.instanceOptions,
      ...this.srcOptions
    };
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
    super(media, params, callback, WrappingClass);
    if (media.tagName != 'VIDEO' || !callback || typeof callback != 'function' || !WrappingClass || WrappingClass.name !== 'AmstramgramMediaPlayer') return;
  }

  _buildUI() {
    if (this.constructor != AmstramgramVideoPlayer || this.init) return;
    new VideoUI(this);
    this.params.$().classList.add('amst__video');
  }
  /**
   * @method hideControls()
   * @description : Hides the video controls bar.
   */


  hideControls() {
    this.emit('amst__hideControls');
  }
  /**
   * @method showControls()
   * @description : Shows the video controls bar.
   */


  showControls() {
    this.emit('amst__showControls');
  }

}
var _instanceOptions = {
  writable: true,
  value: VideoDefaultOptions.instance
};
var _srcOptions = {
  writable: true,
  value: VideoDefaultOptions.src
};

//cSpell:words amstramgram amst   
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
  let array = [],
      proto = Object.getPrototypeOf(instance);

  while (proto && proto !== stop) {
    Object.getOwnPropertyNames(proto).forEach(name => {
      if (name !== 'constructor' && name.charAt(0) != '_') array.push(name);
    });
    proto = Object.getPrototypeOf(proto);
  } //https://stackoverflow.com/a/23282067
  //Returns the array without duplicates
  //We could use 
  //return Array.from(new Set(array))
  //but IE11 returns an empty array


  return array.filter(function (item, i, ar) {
    return ar.indexOf(item) === i;
  });
}
/**
 * @function getDescriptor
 * @param {string} prop : property for which whe need the descriptor
 * @param {object} instance : class instance 
 * @returns {object} property descriptor : 
 * https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/getOwnPropertyDescriptor
 */


function getDescriptor(prop, instance) {
  let descriptor;
  let proto = Object.getPrototypeOf(instance);

  while (Object.getPrototypeOf(proto) && !descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    proto = Object.getPrototypeOf(proto);
  }

  return descriptor;
}
/* -------------------------------------------------------------------------- */

/*                                  END UTILS                                 */

/* -------------------------------------------------------------------------- */

/**
 * Class AmstramgramMediaPlayer.
 */


class AmstramgramMediaPlayer extends EventEmitter {
  /** 
   * @set options
   * @param {Object} params
   * @description : set the default options of the class.
   */
  static set options(params) {
    AmstramgramAudioPlayer.options = params;
    AmstramgramVideoPlayer.options = params;
  }
  /**
   * @get options
   * @returns {Object}
   * @description : returns the default options of the class.
   */


  static get options() {
    return {
      audio: AmstramgramAudioPlayer.options,
      video: AmstramgramVideoPlayer.options
    };
  }
  /** 
   * @set audioOptions
   * @param {Object} params
   * @description : set the default options of the audio players class.
   */


  static set audioOptions(params) {
    AmstramgramAudioPlayer.options = params;
  }
  /**
   * @get audioOptions
   * @returns {Object}
   * @description : returns the default options of the audio players class.
   */


  static get audioOptions() {
    return AmstramgramAudioPlayer.options;
  }
  /** 
   * @set videoOptions
   * @description : set the default options of the video players class.
   */


  static set videoOptions(params) {
    AmstramgramVideoPlayer.options = params;
  }
  /** 
   * @get videoOptions
   * @returns {Object}
   * @description : returns the default options of the video players class.
   */


  static get videoOptions() {
    return AmstramgramVideoPlayer.options;
  }
  /** 
   * @get players
   * @returns {Array}
   * @description : Returns an array of all instantiated players.
   */


  static get players() {
    return AmstramgramAudioPlayer.players;
  }
  /** 
   * @get currentPlayer
   * @returns {AmstramgramAudioPlayer|AmstramgramVideoPlayer|undefined}
   * @description : Returns the current player or undefined if there is none.
  */


  static get currentPlayer() {
    return AmstramgramAudioPlayer.currentPlayer;
  }
  /**
   * CONSTRUCTOR
   * @param {HTMLElement} media - HTMLMediaElement associated to the player
   * @param {Object} params - player parameters
   * @param {function} callback - function called after the instance has been initialized
   */


  constructor(media, params = {}, callback) {
    super();
    if (!media || media.tagName != 'AUDIO' && media.tagName != 'VIDEO') return;
    const self = this; //For IE11

    if (AmstramgramMediaPlayer.name === undefined) AmstramgramMediaPlayer.name = 'AmstramgramMediaPlayer';

    if (media.tagName == 'AUDIO') {
      new AmstramgramAudioPlayer(media, params, onPlayerInit, AmstramgramMediaPlayer);
    } else {
      new AmstramgramVideoPlayer(media, params, onPlayerInit, AmstramgramMediaPlayer);
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
        let desc = {};

        if (getDescriptor(m, this).set) {
          //currentTime - muted - src - volume
          desc.set = val => this[m] = val;
        }

        if (getDescriptor(m, this).get) {
          //init - currentTime - muted - paused - src - volume
          desc.get = _ => {
            return this[m];
          };
        }

        if (getDescriptor(m, this).value) {
          //pause - play -toggle
          desc.value = _ => this[m]();
        }

        Object.defineProperty(self, m, desc);
      });
      //AmstramgramAudioPlayer : ["events", "params", "download", "next", "more", "mute", "playPause", "previous", "settings", "subtitles"]
      //AmstramgramVideoPlayer : ["events", "params", "download", "next", "more", "mute", "playPause", "previous", "settings", "subtitles", "fullscreen", "pip"]

      Object.getOwnPropertyNames(this).forEach(p => {
        let desc = {};

        if (Object.getOwnPropertyDescriptor(this, p).set) {
          //download - next - more - mute - playPause - previous - settings - subtitles - fullscreen - pip
          desc.set = val => this[p] = val;
        }

        if (Object.getOwnPropertyDescriptor(this, p).value) {
          //events - params
          desc.value = this[p];
        }

        Object.defineProperty(self, p, desc);
      });

      if (callback && typeof callback === "function") {
        setTimeout(_ => callback.call(self), 0);
      }
    }
  }

}

export default AmstramgramMediaPlayer;
