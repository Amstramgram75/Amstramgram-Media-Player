/****************************************
  amstramgramAudioPlayer.js
  @version : 1.0.0
  @licence : MIT
  @author : Amstramgram
  @url : https://amp.onfaitdessites.fr/
****************************************/


'use strict';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function set(target, property, value, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.set) {
    set = Reflect.set;
  } else {
    set = function set(target, property, value, receiver) {
      var base = _superPropBase(target, property);

      var desc;

      if (base) {
        desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.set) {
          desc.set.call(receiver, value);
          return true;
        } else if (!desc.writable) {
          return false;
        }
      }

      desc = Object.getOwnPropertyDescriptor(receiver, property);

      if (desc) {
        if (!desc.writable) {
          return false;
        }

        desc.value = value;
        Object.defineProperty(receiver, property, desc);
      } else {
        _defineProperty(receiver, property, value);
      }

      return true;
    };
  }

  return set(target, property, value, receiver);
}

function _set(target, property, value, receiver, isStrict) {
  var s = set(target, property, value, receiver || target);

  if (!s && isStrict) {
    throw new Error('failed to set property');
  }

  return value;
}

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

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
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.events = {};
  }

  _createClass(EventEmitter, [{
    key: "_getEventListByName",
    value: function _getEventListByName(eventName) {
      if (typeof this.events[eventName] === 'undefined') {
        this.events[eventName] = new Set();
      }

      return this.events[eventName];
    }
  }, {
    key: "on",
    value: function on(eventsNames, fn) {
      var self = this;
      eventsNames.split(' ').forEach(function (eventName) {
        //Skip if fn is already registered
        if (!self._getEventListByName(eventName).has(fn)) {
          self._getEventListByName(eventName).add(fn);
        }
      });
      return this;
    }
  }, {
    key: "emit",
    value: function emit(eventName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this._getEventListByName(eventName).forEach(function (fn) {
        fn.apply(this, args);
      }.bind(this));

      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, fn) {
      this._getEventListByName(eventName).delete(fn);
    }
  }]);

  return EventEmitter;
}();

/**
 * 
 * @param {String} events - Name of the events to throttle (separated by space)
 * @param {String} name 
 * @param {EventTarget} obj 
 */
var throttle = function throttle(events, name, obj) {
  if (typeof obj == 'undefined') {
    if (typeof window !== 'undefined') obj = window;else return;
  }

  var running = false,
      func = function func(e) {
    if (running) return;
    running = true;
    requestAnimationFrame(function () {
      obj.dispatchEvent(new CustomEvent(name, {
        detail: e
      }));
      running = false;
    });
  };

  events.split(' ').forEach(function (event) {
    return obj.addEventListener(event, func);
  });
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
    Object.keys(source).forEach(function (key) {
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key]);
      } else if (key in target && (_typeof(target[key]) == _typeof(source[key]) || target[key] === undefined)) {
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
  var copy = {};
  Object.keys(o).forEach(function (key) {
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
      var o = params[0];

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

    return params.filter(function (o) {
      return o.src && checkString(o.src) && o.quality && checkString(o.quality);
    }).filter(function (o) {
      return !o.type || o.type && media.canPlayType(o.type);
    });
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


function buildSrcParams(params, media) {
  var init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var result = buildSrc(params, media);
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
    var sources = [];
    var sourcesTag = Array.from(media.querySelectorAll('source'));

    if (sourcesTag.length > 0) {
      sourcesTag.forEach(function (s) {
        var o = {};
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

function secondsToTimeCode(t) {
  var long = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (isNaN(t)) {
    return long ? '00:00:00' : '00:00';
  }

  t = Math.round(t);
  var h = Math.floor(t / 3600),
      m = Math.floor((t - h * 3600) / 60),
      s = Math.round(t % 60);
  h = h > 9 ? h + ':' : h > 0 ? '0' + h + ':' : long ? '00:' : '';
  m = m > 9 ? m : '0' + m;
  s = s > 9 ? s : '0' + s;
  return h + m + ':' + s;
}

var instanceOptions = {
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
    srcOptions = {
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

var AudioDefaultOptions = /*#__PURE__*/function () {
  function AudioDefaultOptions() {
    _classCallCheck(this, AudioDefaultOptions);
  }

  _createClass(AudioDefaultOptions, null, [{
    key: "instance",
    get:
    /**
     * @getter instance
     * @returns {Object}
     * @description returns the default options for an AmstramgramAudioPlayer instance
     */
    function get() {
      return _objectSpread2({}, instanceOptions);
    }
    /**
     * @getter src
     * @returns {Object}
     * @description returns the default parameters for an AmstramgramAudioPlayer src
     */

  }, {
    key: "src",
    get: function get() {
      return clone(srcOptions);
    }
  }]);

  return AudioDefaultOptions;
}();

/*
  PASSIVE EVENTS SUPPORT
  https://github.com/WICG/EventListenerOptions/blob/gh-pages/EventListenerOptions.polyfill.js
*/
var supportEventOptions = false;
document.createElement("div").addEventListener("test", function (_) {}, {
  get once() {
    supportEventOptions = true;
    return false;
  }

});

var _$ = function _$(context) {
  context = typeof context === 'string' && document.querySelector(context) ? document.querySelector(context) : context;

  var $ = function $() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;
    var el = typeof selector === 'string' && context.querySelector(selector) ? context.querySelector(selector) : selector;
    if (!el.tagName) return;

    el.css = function (newCSS) {
      if (typeof newCSS === 'string') {
        var v = window.getComputedStyle(el, null).getPropertyValue(newCSS);
        return isNaN(parseFloat(v)) ? v : parseFloat(v);
      } else {
        Object.assign(el.style, newCSS);
        return el;
      }
    };

    el.setAttributes = function (attrs) {
      Object.keys(attrs).forEach(function (key) {
        return el.setAttribute(key, attrs[key]);
      });
      return el;
    };

    el.on = function (events, handler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      events.split(' ').forEach(function (e) {
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
      events.split(' ').forEach(function (e) {
        return el.removeEventListener(e, handler);
      });
      return el;
    };

    return el;
  };

  return $;
};

var _$$ = function _$$(context) {
  context = typeof context === 'string' && document.querySelector(context) ? document.querySelector(context) : context;

  var $$ = function $$(selector) {
    var els = Array.isArray(selector) ? selector : Array.from(context.querySelectorAll(selector));

    els.css = function (newCSS) {
      if (typeof newCSS === 'string') {
        var v = window.getComputedStyle(els[0], null).getPropertyValue(newCSS);
        return isNaN(parseFloat(v)) ? v : parseFloat(v);
      } else {
        els.forEach(function (el) {
          return Object.assign(el.style, newCSS);
        });
        return els;
      }
    };

    els.on = function (events, handler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      els.forEach(function (el) {
        return events.split(' ').forEach(function (e) {
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
      });
      return els;
    };

    els.off = function (events, handler) {
      els.forEach(function (el) {
        return events.split(' ').forEach(function (e) {
          return el.removeEventListener(e, handler);
        });
      });
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

var PointerDetector = /*#__PURE__*/function (_EventEmitter) {
  _inherits(PointerDetector, _EventEmitter);

  var _super = _createSuper(PointerDetector);

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
  function PointerDetector() {
    var _this;

    _classCallCheck(this, PointerDetector);

    //If first instantiation
    if (!PointerDetector.pointerDetector) {
      _this = _super.call(this);

      _currentPointerType.set(_assertThisInitialized(_this), {
        writable: true,
        value: void 0
      });

      _data.set(_assertThisInitialized(_this), {
        writable: true,
        value: {}
      });

      var w = window,
          s = w.sessionStorage,
          self = _assertThisInitialized(_this),

      /*
        If PointerEvent is detected, pointerEventsInterface is set to 'pointer'.
        If not and if TouchEvent is detected, pointerEventsInterface is set to 'touch'.
        Finally, if neither PointerEvent nor TouchEvent are detected, pointerEventsInterface is set to 'mouse'.
      */
      pointerEventsInterface = _classPrivateFieldGet(_assertThisInitialized(_this), _data).pointerEventsInterface = w.PointerEvent ? 'pointer' : w.TouchEvent ? 'touch' : 'mouse'; //Setting the resulting events names


      _classPrivateFieldGet(_assertThisInitialized(_this), _data).pointerenter = pointerEventsInterface == 'touch' ? 'none' : pointerEventsInterface + 'enter';
      _classPrivateFieldGet(_assertThisInitialized(_this), _data).pointerleave = pointerEventsInterface == 'touch' ? 'none' : pointerEventsInterface + 'leave';
      _classPrivateFieldGet(_assertThisInitialized(_this), _data).pointerup = pointerEventsInterface == 'touch' ? 'touchend' : pointerEventsInterface + 'up';
      _classPrivateFieldGet(_assertThisInitialized(_this), _data).pointerdown = pointerEventsInterface == 'touch' ? 'touchstart' : pointerEventsInterface + 'down';
      _classPrivateFieldGet(_assertThisInitialized(_this), _data).pointermove = pointerEventsInterface + 'move'; //If not already stored, storing the currentPointerType value in session storage

      if (!s.hasOwnProperty('amst__currentPointerType')) {
        if (pointerEventsInterface == 'pointer') {
          //By default, we consider that touch is used;
          s.setItem('amst__currentPointerType', 'touch');
        } else {
          //pointerEventsInterface = 'mouse' or pointerEventsInterface = 'touch'
          s.setItem('amst__currentPointerType', pointerEventsInterface);
        }
      }

      _classPrivateFieldSet(_assertThisInitialized(_this), _currentPointerType, s.getItem('amst__currentPointerType'));
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

      PointerDetector.pointerDetector = _assertThisInitialized(_this);
    }

    return _possibleConstructorReturn(_this, PointerDetector.pointerDetector);
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


  _createClass(PointerDetector, [{
    key: "currentPointerType",
    get: function get() {
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

  }, {
    key: "data",
    get: function get() {
      return _classPrivateFieldGet(this, _data);
    }
    /* -------------------------------------------------------------------------- */

    /*                                 END GETTERS                                */

    /* -------------------------------------------------------------------------- */

  }]);

  return PointerDetector;
}(EventEmitter); //Creating, freezing and exporting an unique instance


var pointerDetector = new PointerDetector();
Object.freeze(pointerDetector);

var _hidden = new WeakMap();

//cSpell:words amstramgram amst tabindex beforeend

/**
 * Class Button.
 * @HTML :
 *  <div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>
 */
var Button = /*#__PURE__*/function () {
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
  function Button(name, player, ui) {
    var _this = this;

    var backgroundClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "amst__svg-background";

    _classCallCheck(this, Button);

    _hidden.set(this, {
      writable: true,
      value: void 0
    });

    backgroundClass = backgroundClass === '' ? '' : " class=\"".concat(backgroundClass, "\""); //Insertion of the button in the ui

    ui.insertAdjacentHTML('beforeend', "<div role=\"button\" class=\"amst__".concat(name, "\" tabindex=\"0\"><div").concat(backgroundClass, "></div></div>"));
    this.name = name;
    this.player = player;
    this.params = player.params[name];
    this.button = ui.querySelector(".amst__".concat(name));

    _classPrivateFieldSet(this, _hidden, this.params.hidden); //Listening to the click event


    this.button.addEventListener('click', function (e) {
      return _this.player.emit("amst__".concat(name, "-click"), _this, e);
    }); //Listening to the focus event

    this.button.addEventListener('focus', function (_) {
      return _this.player.emit('amst__focus');
    });
    player.on("amst__src-change amst__".concat(name, "-should-update"), function (_) {
      return _this.update();
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
   * @param {String} label - button label
   * toggleButtons pass a label depending of their state on/off
   * 
   * @description : updates the button properties (label/disabled/hidden/tooltip)
   * called on amst__src-change and amst__${name}-should-update events
   */


  _createClass(Button, [{
    key: "update",
    value: function update() {
      var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.params.label;
      var b = this.button,
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

      this.player.emit("amst__".concat(this.name, "-update"), this);
    }
    /* -------------------------------------------------------------------------- */

    /*                                 END METHODS                                */

    /* -------------------------------------------------------------------------- */

  }]);

  return Button;
}();

/**
 * Class ToggleButton.
 * @extends Button
 * 
 * @HTML :
    <div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>
 * @description : Used for Play, Mute, Subtitles, PIP and Fullscreen buttons.
 */

var _state$1 = new WeakMap();

var ToggleButton = /*#__PURE__*/function (_Button) {
  _inherits(ToggleButton, _Button);

  var _super = _createSuper(ToggleButton);

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
  function ToggleButton(name, player, ui, backgroundClass) {
    var _this;

    _classCallCheck(this, ToggleButton);

    //Call the button constructor
    _this = _super.call(this, name, player, ui, backgroundClass);

    _state$1.set(_assertThisInitialized(_this), {
      writable: true,
      value: false
    });

    return _this;
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


  _createClass(ToggleButton, [{
    key: "update",
    value: function update() {
      //Pass the label according to the state
      _get(_getPrototypeOf(ToggleButton.prototype), "update", this).call(this, this.state ? this.params.label.on : this.params.label.off);
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

  }, {
    key: "state",
    get: function get() {
      return _classPrivateFieldGet(this, _state$1);
    }
    /**
     * @setter
     * @param {Boolean} state
     * @description : Set the button state
     */
    ,
    set: function set(state) {
      if (state != _classPrivateFieldGet(this, _state$1)) {
        var b = this.button;

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

  }]);

  return ToggleButton;
}(Button);

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

var MuteButton = /*#__PURE__*/function (_ToggleButton) {
  _inherits(MuteButton, _ToggleButton);

  var _super = _createSuper(MuteButton);

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
  function MuteButton(player, ui) {
    var _this;

    _classCallCheck(this, MuteButton);

    //Call the toggleButton constructor
    _this = _super.call(this, 'mute', player, ui);
    var playerParams = player.params,
        storage = window.sessionStorage;
    if (playerParams.isMobile) playerParams.volumeBeforeMute = 1; //Listening to volumechange event to update the button state

    playerParams.media.on('volumechange', function (_) {
      var v = player.volume; //Updating storage

      storage.setItem("amst__volumegroup".concat(playerParams.volumeGroup), v); //Updating volumeBeforeMute if possible

      if (v > 0.1 && !playerParams.isMobile) playerParams.volumeBeforeMute = v;
      _this.state = player.muted;
    });
    player.on('amst__src-change', function (_) {
      if (playerParams.volumeForced === true || !storage.getItem("amst__volumegroup".concat(playerParams.volumeGroup))) {
        storage.setItem("amst__volumegroup".concat(playerParams.volumeGroup), playerParams.volume); //If not and if there is already a relevant value stored :
      } else if (storage.getItem("amst__volumegroup".concat(playerParams.volumeGroup))) {
        //this value is set to the volume
        playerParams.volume = Number(storage.getItem("amst__volumegroup".concat(playerParams.volumeGroup)));
      }

      player.volume = playerParams.volume;
      _this.state = player.muted;
    }).on('amst__mute-click', function (_) {
      if (playerParams.isMobile || playerParams.currentPointerType == 'mouse' || playerParams.volumeOrientation == 'horizontal') {
        _this.toggle();
      }
    }); //Keyboard events

    playerParams.$().on('keydown', function (e) {
      if (_this.params.disabled || _this.params.hidden || e.which != 77) return;
      e.preventDefault();

      _this.toggle(); //Reset focus to force the amst__focus event


      _this.button.blur();

      _this.button.focus();
    });
    return _this;
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   METHODS                                  */

  /* -------------------------------------------------------------------------- */


  _createClass(MuteButton, [{
    key: "update",
    value: function update() {
      var p = this.player.params;

      if (!p.isMobile) {
        if (this.params.hidden == true) {
          p.$('.amst__volume').classList.add('amst__hidden');
        } else {
          p.$('.amst__volume').classList.remove('amst__hidden');
        }
      }

      _get(_getPrototypeOf(MuteButton.prototype), "update", this).call(this);
    }
    /**
     * @method toggle()
     * @description : toggles the button state
     */

  }, {
    key: "toggle",
    value: function toggle() {
      this.state = !this.state;
      this.player.volume = this.state ? 0 : this.player.params.volumeBeforeMute;
    }
    /* -------------------------------------------------------------------------- */

    /*                                 END METHOD                                 */

    /* -------------------------------------------------------------------------- */

  }]);

  return MuteButton;
}(ToggleButton);

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

var Slider = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Slider, _EventEmitter);

  var _super = _createSuper(Slider);

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
  function Slider(player, ui) {
    var _this;

    var vertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var reactiveArea = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, Slider);

    _this = _super.call(this); //Slider HTML insertion

    ui.insertAdjacentHTML('beforeend', "\n      <div class=\"amst__slider\" aria-valuemin=\"0\" aria-valuemax=\"1\" role=\"slider\" tabindex=\"0\">\n        <div class=\"amst__slider-total\">\n          <div class=\"amst__slider-current\"></div>\n        </div>\n      </div>\n    ");

    var self = _assertThisInitialized(_this),
        $ = _$(ui.querySelector('.amst__slider')),
        params = player.params; //Instance properties used only by inherited classes


    _this.params = params;
    _this.slider = $();
    _this.total = $('.amst__slider-total');
    _this.current = $('.amst__slider-current');
    _this.referenceRect = _this.total.getBoundingClientRect();

    _this.slider.on('focus', function (_) {
      return player.emit('amst__focus');
    }); //Show videoUI controls 
    //If reactiveArea is not specified, it's set to the slider itself


    reactiveArea = reactiveArea || $(); //Getting the reference position/dimension. 
    //Those data change on scroll and resize events unified and throttled by the amst__resize event.

    player.on('amst__resize', referenceRectUpdate); //But vertical sliders are hidden by default, so we have to wait for mouseenter event.

    if (vertical) reactiveArea.on(params.pointerenter, referenceRectUpdate); //Getting the reference position/dimension on player initialization

    params.media.on('loadedmetadata', referenceRectUpdate); //Pointer events listeners

    function pointerdown(e) {
      var ref = self.referenceRect,
          cleanEvents = 'pointerId' in e ? "".concat(params.pointerup) : "".concat(params.pointerleave, " ").concat(params.pointerup);
      if ('pointerId' in e) reactiveArea.setPointerCapture(e.pointerId); //Get the ratio between the coordinates of the pointer position relative to the reference

      function getRatio(e) {
        var ratio;
        var x = e.clientX || e.pageX - window.pageXOffset,
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
        reactiveArea.off("".concat(params.pointermove, " ").concat(params.pointerup), getRatio).off(cleanEvents, clean);
      } //As soon as pointer is down, we watch for move and up to get ratio changes
      //On leave and up, we stop watching


      reactiveArea.on("".concat(params.pointermove, " ").concat(params.pointerup), getRatio).on(cleanEvents, clean);
    } //Start listening on pointerdown event


    reactiveArea.on(params.pointerdown, pointerdown);

    function referenceRectUpdate() {
      //Timer to be sure to get right dimensions when entering fullscreen
      //On Chrome, if no timer, 
      //self.total.getBoundingClientRect().width = 0 
      //when entering fullscreen
      setTimeout(function (_) {
        self.referenceRect = self.total.getBoundingClientRect();
      }, 1);
    }

    return _this;
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */


  return Slider;
}(EventEmitter);

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

var VolumeSlider = /*#__PURE__*/function (_Slider) {
  _inherits(VolumeSlider, _Slider);

  var _super = _createSuper(VolumeSlider);

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
  function VolumeSlider(player, ui) {
    var _this;

    var vertical = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, VolumeSlider);

    _this = _super.call(this, player, ui, vertical);
    var slider = _this.slider,
        params = _this.params,
        media = params.media,
        current = _this.current; //HTML adjustments

    slider.setAttribute('aria-label', player.params.volumeSliderLabel);
    slider.insertAdjacentHTML('afterbegin', "<span class=\"amst__offscreen\">".concat(player.params.volumeSliderHelpText, "</span>")); //Keyboard events

    params.$().on('keydown', function (e) {
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

    _this.on('amst__slider-change', function (vol) {
      return player.volume = vol;
    }); //on volume changes


    media.on('volumechange', update); //on player initialization

    player.on('amst__src-change', update);

    function update() {
      var v = Math.round(player.volume * 100);
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
    return _this;
  }

  return VolumeSlider;
}(Slider);

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

var VolumeButton = /*#__PURE__*/function (_VolumeSlider) {
  _inherits(VolumeButton, _VolumeSlider);

  var _super = _createSuper(VolumeButton);

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
  function VolumeButton(player, ui) {
    var _this;

    _classCallCheck(this, VolumeButton);

    var params = player.params,
        volumeOrientation = params.volumeHorizontal !== true ? ' amst__vertical' : ''; // volumeOrientation = (params.volumeOrientation == 'vertical') ? ' amst__vertical' : ''
    //Volume wrapper HTML insertion

    ui.insertAdjacentHTML('beforeend', "<div class=\"amst__volume".concat(volumeOrientation, "\"><div class=\"amst__volume-wrapper\"></div></div>"));
    var wrapper = ui.querySelector('.amst__volume-wrapper'); //Mute button HTML insertion

    var muteButton = new MuteButton(player, wrapper); //volumeSlider instantiation

    _this = _super.call(this, player, wrapper, volumeOrientation == ' amst__vertical'); //Prevent change of the volumeHorizontal parameter

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

    var slider = _this.slider;
    var //Timeout used to hide the slider after the delay given by the instance parameter hideControlsDelay
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
        hideSliderTimeout = setTimeout(function (_) {
          hideSliderTimeout = false;
          slider.classList.remove('amst__show');
        }, params.hideControlsDelay);
      }
    } //Reset the hideSliderTimeout when volume changes


    params.media.on('volumechange', hideSlider);

    if (params.volumeOrientation == 'vertical') {
      //Hides the slider if main video controls are hidden
      if (params.type == 'video') {
        player.on('amst__controlsAreHidden', function (_) {
          if (params.currentPointerType != 'mouse') slider.classList.remove('amst__show');
        });
      }

      muteButton.button.addEventListener(params.pointerdown, function (_) {
        //Only if necessary...
        if (params.currentPointerType != 'mouse') {
          //Canceling the hideSliderTimeout timer
          if (hideSliderTimeout) clearTimeout(hideSliderTimeout); //If first tap

          if (timeNow == 0) {
            //Stores the timestamp
            timeNow = Date.now(); //Set up the clickTimeout timer

            clickTimeout = setTimeout(function (_) {
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

    return _this;
  }

  return VolumeButton;
}(VolumeSlider);

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

var TimeSlider = /*#__PURE__*/function (_Slider) {
  _inherits(TimeSlider, _Slider);

  var _super = _createSuper(TimeSlider);

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
  function TimeSlider(player, ui) {
    var _this;

    _classCallCheck(this, TimeSlider);

    ui.insertAdjacentHTML('beforeend', "\n      <div class=\"amst__time amst__time-current\" role=\"timer\" aria-live=\"off\"><span class=\"amst__currenttime\"></span></div>\n      <div class=\"amst__time-rail\">\n        <div class=\"amst__time-slider\"></div>\n      </div>\n      <div class=\"amst__time amst__time-duration\"><span class=\"amst__duration\"></span></div>\n    ");

    var $ = _$(ui.querySelector('.amst__time-slider')); //Insert the slider in the ui
    //Reactive area is set to the ui


    _this = _super.call(this, player, $(), false, $());
    $('.amst__slider').insertAdjacentHTML('afterbegin', "<span class=\"amst__offscreen\">".concat(player.params.timeSliderHelpText, "</span>"));
    $('.amst__slider').setAttribute('aria-label', player.params.timeSliderLabel); //HTML adjustments

    _this.total.insertAdjacentHTML('afterbegin', '<canvas class="amst__loaded-bar"></canvas>');

    _this.total.insertAdjacentHTML('beforeend', "\n      <div class=\"amst__buffering-bar\"></div>\n      <div class=\"amst__cursor\"><div></div></div>\n      <div class=\"amst__seeking-wrapper\">\n        <div class=\"amst__time amst__seeking\">\n          <span></span>\n        </div>\n      </div>\n      <div class=\"amst__time-handler\"></div>\n    ");

    var self = _assertThisInitialized(_this),
        params = _this.params,
        media = params.media,
        wrapper = params.$(),
        slider = _this.slider,
        current = _this.current,
        handler = $('.amst__time-handler'),
        cursor = $('.amst__cursor'),
        seeking = $('.amst__seeking-wrapper'),
        seekingTime = $('.amst__seeking-wrapper span');

    var mustShowHours = params.alwaysShowHours,
        buffered,
        seekingOffset;
    player.on('amst__src-change', function (_) {
      //Remove the slider changes listener
      _this.off('amst__slider-change', update);

      buffered = undefined;
      seekingOffset = undefined;
      updateDuration();
    });
    media.on('timeupdate', update).on('progress', updateBuffer).on('durationchange', updateDuration).on('loadedmetadata', function (_) {
      return _this.on('amst__slider-change', update);
    }).on('ended', function (_) {
      media.currentTime = 0;
      player.pause();
    });

    function updateDuration() {
      if (media.duration) params.duration = media.duration;
      mustShowHours = params.alwaysShowHours || params.duration >= 3600;

      if (mustShowHours) {
        params.$$('.amst__time').forEach(function (el) {
          return el.classList.add('amst__long');
        });
      } else {
        params.$$('.amst__time').forEach(function (el) {
          return el.classList.remove('amst__long');
        });
      }

      params.$('.amst__currenttime').innerHTML = secondsToTimeCode(media.currentTime || 0, mustShowHours);
      params.$('.amst__duration').innerHTML = secondsToTimeCode(params.duration, mustShowHours);
      slider.setAttribute('aria-valuemax', params.duration);
      update(media.currentTime / params.duration);
    } //Left and right Arrows move the playback head by a step defined by the skipTime parameter.


    wrapper.on('keydown', function (e) {
      if ([37, 39].includes(e.which) && wrapper.classList.contains('amst__loadedmetadata')) e.preventDefault();else return; //Reset focus to force the amst__focus event

      slider.blur();
      slider.focus(); //The skipTime parameter can be a percent or an integer

      var skipTime = typeof params.skipTime == 'string' && params.skipTime.slice(-1) == '%' ? parseInt(params.skipTime) * media.duration / 100 : parseInt(params.skipTime);

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

    var loadedBar = $('.amst__loaded-bar'),
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
        var inc = loadedBar.width / media.duration;

        for (var i = 0; i < media.buffered.length; i++) {
          var start = media.buffered.start(i) * inc,
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
    $().on('amst__optimizedPointerMove', function (e) {
      if (!media.duration || e.detail.pointerType && e.detail.pointerType == 'touch') return; //The seeking element indicates the media time corresponding to the pointer position.
      //The deal is to avoid that it goes beyond the cursor boundaries when this one reaches the slider edges
      //So we need to know its width and also these of the cursor
      //Those measures are made each time the media source changes .

      if (!seekingOffset) {
        //If not yet known
        var cursorInner = $('.amst__cursor>div');
        seekingOffset = 0.5 * seeking.css("width");
        seekingOffset -= parseInt(window.getComputedStyle(cursorInner, ':after').getPropertyValue("border-bottom-width"));
        seekingOffset -= 0.5 * cursorInner.css('width');
      } //Getting the pointer horizontal position relative to the slider


      var x = e.detail.clientX || e.detail.pageX - window.pageXOffset;
      var pos = x - _this.referenceRect.left; //The reactive area is much wider than the slider
      //And we must restrain the result

      pos = Math.max(Math.min(pos, _this.referenceRect.width), 0); //Updating the time indicator

      var ratio = pos / _this.referenceRect.width;
      seekingTime.innerHTML = secondsToTimeCode(media.duration * ratio, mustShowHours); //the cursor position

      cursor.css({
        transform: "translateX(".concat(pos, "px)")
      }); //and the seeking position.
      //We manage so it does not overflow the slider

      pos = Math.max(pos, seekingOffset);
      pos = Math.min(pos, _this.referenceRect.width - seekingOffset);
      seeking.css({
        transform: "translateX(".concat(pos, "px)")
      }); //For the video player on desktop, the pointer movement must update the thumb displayed
      //This event is eventually treated in the videoUI class

      if (params.type == 'video') _this.emit('amst__move-over-time-slider', ratio);
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

    var updateTimeout, updateTimeRailAnimation;

    function update(ratio) {
      cancelAnimationFrame(updateTimeRailAnimation);
      if (!params.duration) return;

      if (typeof ratio === 'number' && ratio > 0) {
        //update is called by the slider change event
        //Suspend the media timeupdate event listener
        media.off('timeupdate', update);
        clearTimeout(updateTimeout); //Update the media currentTime

        media.currentTime = ratio * params.duration; //Reactivate the media timeupdate event listener after 50ms

        updateTimeout = setTimeout(function (_) {
          return media.on('timeupdate', update);
        }, 50);
      } //Update the slider components


      updateTimeRail();
      updateBuffer();
      var currentTime = media.currentTime; //Update all the player current time indicators

      params.$$('.amst__currenttime').forEach(function (el) {
        return el.innerHTML = secondsToTimeCode(currentTime, mustShowHours);
      }); //Update the slider attributes

      slider.setAttributes({
        'aria-valuenow': currentTime,
        'aria-valuetext': secondsToTimeCode(currentTime)
      });
    }

    function updateTimeRail() {
      var ratio = media.currentTime / params.duration;
      ratio = Math.max(0, Math.min(ratio, 1));
      current.style.transform = "scaleX(".concat(ratio, ")");
      handler.style.transform = "translateX(".concat(ratio * self.referenceRect.width, "px)");
      if (params.type == 'video') self.emit('amst__time-slider-update', ratio);
      if (!media.paused) updateTimeRailAnimation = requestAnimationFrame(updateTimeRail);
    }

    return _this;
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */


  return TimeSlider;
}(Slider); //http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html

var AmstRoundedRect = function AmstRoundedRect(ctx, h, x, w) {
  _classCallCheck(this, AmstRoundedRect);

  var y = 0,
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
};
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
    for (var i = 0; i < t1.length; i++) {
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

var SubtitlesButton = /*#__PURE__*/function (_ToggleButton) {
  _inherits(SubtitlesButton, _ToggleButton);

  var _super = _createSuper(SubtitlesButton);

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
  function SubtitlesButton(player, ui) {
    var _this;

    _classCallCheck(this, SubtitlesButton);

    //Call the toggleButton constructor
    _this = _super.call(this, 'subtitles', player, ui);

    _buildTextTracks.add(_assertThisInitialized(_this));

    _init$1.set(_assertThisInitialized(_this), {
      writable: true,
      value: false
    });

    var _params = _this.params,
        media = _this.media = player.params.media;

    if (_params.sources.length == 0) {
      //No subtitles src in parameters
      //Retrieve the HTML subtitles tracks and build the params.sources array
      var subsSources = [],
          tracks = player.params.$$('track[src][srclang][label]', media);

      if (tracks.length > 0) {
        tracks.forEach(function (t) {
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

    player.on('amst__src-change', function (_) {
      return _classPrivateMethodGet(_assertThisInitialized(_this), _buildTextTracks, _buildTextTracks2).call(_assertThisInitialized(_this));
    });
    player.on('amst__subtitles-click', function (_) {
      return _this.state = !_this.state;
    });
    return _this;
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


  _createClass(SubtitlesButton, [{
    key: "state",
    get:
    /* -------------------------------------------------------------------------- */

    /*                             STATE GETTER/SETTER                            */

    /* -------------------------------------------------------------------------- */

    /**
     * @getter
     * @return {Boolean}
     * @description : Return the button state
     */
    function get() {
      return _get(_getPrototypeOf(SubtitlesButton.prototype), "state", this);
    }
    /**
     * @setter
     * @param {Boolean} state
     * @description : Set the button state - hides/shows the subtitles
     *    
     */
    ,
    set: function set(state) {
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


      _set(_getPrototypeOf(SubtitlesButton.prototype), "state", this.params.state = state, this, true);
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

  }, {
    key: "update",
    value: function update() {
      this.wrapper = null;
      this.container = null;
      var params = this.params;

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

      _get(_getPrototypeOf(SubtitlesButton.prototype), "update", this).call(this);
    }
  }]);

  return SubtitlesButton;
}(ToggleButton);
/* -------------------------------------------------------------------------- */

/*                              UTILITY FUNCTIONS                             */

/* -------------------------------------------------------------------------- */

/**
 * @method isString()
 * @param {string} str
 * @description return true if str is a string and not empty
 */


var _buildTextTracks2 = function _buildTextTracks2() {
  var _this2 = this;

  if (_classPrivateFieldGet(this, _init$1) && this.params.sources.length == 0) {
    this.player.params.$$('track[kind="subtitles"]').forEach(function (t) {
      return t.remove();
    });
  }

  if (this.params.sources.length == 0 || !this.wrapper || !this.container) return;
  var params = this.params; //Sort the sources according to the srclang key alphabetical order

  sortArray(params.sources);
  var html = ''; //Retain only the sources with src, srclang and label properties and write the html

  params.sources.filter(function (s) {
    return isString(s.src) && isString(s.srclang) && isString(s.label);
  }).forEach(function (s) {
    html += "<track kind=\"subtitles\" src=\"".concat(s.src, "\" srclang=\"").concat(s.srclang, "\" label=\"").concat(s.label, "\" type=\"text/vtt\">");
  }); //Insert the result

  this.media.innerHTML = html;
  this.wrapper.classList.add('amst__subtitles-empty');
  var activeTrack = null;
  var textTracks = this.media.textTracks;

  var _loop = function _loop(i) {
    var t = textTracks[i];
    t.mode = 'disabled';
    t.addEventListener("cuechange", function (_) {
      _this2.container.innerHTML = '';
      if (t.activeCues.length > 0) _this2.container.appendChild(t.activeCues[0].getCueAsHTML());

      if (_this2.container.innerHTML == '') {
        _this2.wrapper.classList.add('amst__subtitles-empty');
      } else {
        _this2.wrapper.classList.remove('amst__subtitles-empty');
      }
    }); //Set the default track according to navigator language

    if (t.language == window.navigator.language || t.language.split('-')[0] == window.navigator.language.split('-')[0]) {
      activeTrack = t;
    }
  };

  for (var i = 0; i < textTracks.length; i++) {
    _loop(i);
  } //If there is no track with navigator language, search a track 
  //whose language corresponds to that given by the default parameter.


  if (!activeTrack) {
    for (var _i = 0; _i < textTracks.length; _i++) {
      var t = textTracks[_i];

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


function sortArray(arr) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'label';

  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    var valA = a[key].toUpperCase();
    var valB = b[key].toUpperCase();
    var comparison = 0;

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

var SettingsButton = /*#__PURE__*/function (_Button) {
  _inherits(SettingsButton, _Button);

  var _super = _createSuper(SettingsButton);

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
  function SettingsButton(player, ui) {
    var _this;

    _classCallCheck(this, SettingsButton);

    _this = _super.call(this, 'settings', player, ui);
    /*Insert the settings-display container which contains 
      a div for the close button (only visible on touch screens)
      and a <ul> for :
      SPEED
      QUALITY
      SUBTITLES
    */

    _state.set(_assertThisInitialized(_this), {
      writable: true,
      value: false
    });

    _this.button.insertAdjacentHTML('beforeend', "<div class=\"amst__settings-display\"><div></div><ul></ul></div>");

    var button = _this.button,
        settingsWrapper = button.querySelector('.amst__settings-display'),
        $ = player.params.$,
        //Nodal window contents the settings container when screen width or height is less than 720px
    nodal = _this.nodal = player.params.nodal,
        self = _assertThisInitialized(_this);

    _this.settingsContainer = settingsWrapper.querySelector('ul');
    /*
      If the mouse is used, hovering the button shows the settings panel (via CSS).
      If not, a pointerdown event on button shows/hides the settings panel
    */
    //For pointers other than mouse :

    button.querySelector('.amst__svg-background').addEventListener(player.params.pointerup, function (_) {
      if (player.params.currentPointerType == 'mouse') return;
      _this.state ? hide() : show();
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

        setTimeout(function (_) {
          return nodal.container.addEventListener('click', onNodalClick);
        }, 50);
      } else {
        //Listens to click event on window to hide settings panel
        setTimeout(function (_) {
          return window.addEventListener('click', onWindowClick);
        }, 50);
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
      var el = e.target;

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

    _this.settingsContainer.addEventListener('click', function (e) {
      //If the click occurs on a line not marked as selected, call the change function
      if (e.target.hasAttribute('data-setting') && !e.target.classList.contains('amst__selected')) change(e);
    });
    /**
     * @function change()
     * @param {event} e - needed to get the target properties
     * @description applies the change
     */


    function change(e) {
      var setting = e.target.getAttribute('data-setting'),
          value = e.target.getAttribute('data-value'),
          media = player.params.media,
          oldLine = $("li[data-setting=\"".concat(setting, "\"].amst__selected")),
          oldValue = setting == 'quality' ? oldLine.innerHTML : oldLine.getAttribute('data-value'),
          newLine = $("li[data-value=\"".concat(value, "\"]")),
          newValue = setting == 'quality' ? newLine.innerHTML : value; //reset selected

      $("li[data-setting=\"".concat(setting, "\"].amst__selected")).classList.remove('amst__selected'); //Set new selected

      $("li[data-value=\"".concat(value, "\"]")).classList.add('amst__selected'); //Update nodal content if it's visible

      if (nodal.visible) nodal.show('<ul>' + self.settingsContainer.innerHTML + '</ul>'); //Change playbackRate

      if (setting == 'playbackRate') {
        media.playbackRate = parseFloat(value);
        player.emit('amst__playbackRate-change', oldValue, newValue);
        player.emit('amst__settings-change', 'playbackRate', oldValue, newValue);
      } //Change quality


      if (setting == 'quality') {
        var quality = e.target.textContent,
            s = window.sessionStorage,
            type = player.params.type,
            currentTime = media.currentTime,
            playbackRate = media.playbackRate,
            isPlaying = !player.paused,
            readyState = media.readyState > 0; //Metadata loaded
        //Update default quality in sessionStorage

        if (quality != s.getItem("amst__".concat(type, "DefaultQuality"))) s.setItem("amst__".concat(type, "DefaultQuality"), quality);
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
        for (var i = 0; i < media.textTracks.length; i++) {
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
      var rectTop = button.getBoundingClientRect().top,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (rectTop + scrollTop < 350) {
        settingsWrapper.classList.add('amst__align-bottom');
      } else {
        settingsWrapper.classList.remove('amst__align-bottom');
      }
    }

    return _this;
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


  _createClass(SettingsButton, [{
    key: "state",
    get: function get() {
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

  }, {
    key: "update",
    value: function update() {
      var _this2 = this;

      _get(_getPrototypeOf(SettingsButton.prototype), "update", this).call(this);

      var params = this.params,
          media = this.player.params.media; //Reset the settingsContainer content

      this.settingsContainer.innerHTML = '';

      if (!params.hidden) {
        var listHTML = '',
            //Keep only the sources that have a quality property
        sources = this.player.params.src.filter(function (el) {
          return el.quality;
        });
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
          listHTML = "\n          <li>\n            <span>".concat(params.playbackRatesLabel, "</span>\n            <ul>\n          ");
          params.playbackRates.forEach(function (el) {
            el = Array.isArray(el) ? el : [el, parseFloat(el)];
            var selected = el[1] == _this2.player.params.playbackRate ? ' class="amst__selected"' : '';
            listHTML += "<li data-setting=\"playbackRate\" data-value=\"".concat(el[1], "\"").concat(selected, ">").concat(el[0], "</li>");
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
          listHTML += "\n          <li>\n            <span>".concat(params.qualityLabel, "</span>\n            <ul>\n          ");
          sources.forEach(function (el) {
            var id = media.src.lastIndexOf(el.src),
                selected = id >= 0 && media.src.substring(0, id) + el.src == media.src ? ' class="amst__selected"' : '';
            listHTML += "<li data-setting=\"quality\" data-value=\"".concat(el.src, "\"").concat(selected, ">").concat(el.quality, "</li>");
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
          listHTML += "\n          <li>\n            <span>".concat(params.subsLabel, "</span>\n            <ul>\n          ");

          for (var i = 0; i < media.textTracks.length; i++) {
            var t = media.textTracks[i],
                selected = t.mode == 'hidden' ? ' class="amst__selected"' : '';
            listHTML += "<li data-setting=\"subs\" data-value=\"".concat(t.language, "\"").concat(selected, ">").concat(t.label, "</li>");
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
  }]);

  return SettingsButton;
}(Button);

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

var w$1 = window,
    d = document,
    s$1 = w$1.sessionStorage;
var timeWidth, //Width for durations inferior to one hour.
longTimeWidth; //Width for durations superior or equal to one hour.

if (s$1.getItem('amst__timeWidth')) {
  //If sessionStorage is available and data already stored :
  timeWidth = s$1.getItem('amst__timeWidth');
  longTimeWidth = s$1.getItem('amst__longTimeWidth');
} else {
  var measureTime = d.createElement('div'),
      measureLongTime = d.createElement('div'); //amst__measureTime class is identical to amst__time class
  //but set an absolute position.

  measureTime.classList.add('amst__measureTime');
  measureTime.innerHTML = '<span>00:00<span>';
  measureLongTime.classList.add('amst__measureTime');
  measureLongTime.innerHTML = '<span>00:00:00<span>';
  d.body.appendChild(measureTime);
  d.body.appendChild(measureLongTime);
  timeWidth = measureTime.offsetWidth + 2;
  longTimeWidth = measureLongTime.offsetWidth + 2;
  d.body.removeChild(measureTime);
  d.body.removeChild(measureLongTime);
  s$1.setItem('amst__timeWidth', timeWidth);
  s$1.setItem('amst__longTimeWidth', longTimeWidth);
} //Resulting rules are inserted in the DOM


var style = d.createElement("style"); // WebKit hack

style.appendChild(d.createTextNode(""));
d.head.appendChild(style);
style.sheet.insertRule(".amst__time>span{width:".concat(timeWidth, "px;"), 0);
style.sheet.insertRule(".amst__time.amst__long>span{width:".concat(longTimeWidth, "px;"), 0); //END WIDTH CALCULATION OF THE TIMING DISPLAY ELEMENTS

/* -------------------------------------------------------------------------- */

/*                                  END UTILS                                 */

/* -------------------------------------------------------------------------- */

/**
 * Class AudioUI.
 * @description Create the UI for AmstramgramAudioPlayer
 */

var AudioUI = /*#__PURE__*/function () {
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
  function AudioUI(player) {
    var _this = this;

    _classCallCheck(this, AudioUI);

    var self = this,
        params = player.params,
        $ = params.$,
        $$ = params.$$,
        media = params.media,
        container = $('.amst__container'),
        controls = $(d.createElement('div'));
    this.player = player;
    /* -------------------------------------------------------------------------- */

    /*                               BUILDING THE UI                              */

    /* -------------------------------------------------------------------------- */
    //Previous button

    new Button('previous', player, controls); //PlayPauseButton button

    var playPauseButton = new ToggleButton('playPause', player, controls); //Play button click event

    player.on('amst__playPause-click', function (button) {
      return button.state ? player.pause() : player.play();
    }); //Next button

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

    var additionalControls = $(d.createElement('div'));
    additionalControls.classList.add('amst__additional-controls'); //Subtitles button

    new SubtitlesButton(player, additionalControls); //Settings button
    //this because we need to know its state in videoUI :
    //Controls should remain visible as long as its state is on

    this.settingsButton = new SettingsButton(player, additionalControls); //Download button

    new Button('download', player, additionalControls);
    player.on('amst__download-click', function (b) {
      if (!b.params.disabled) {
        var a = d.createElement('a');
        a.href = media.src;
        a.download = decodeURI(media.src.substring(media.src.lastIndexOf('/') + 1));
        d.body.appendChild(a);
        a.click();
        d.body.removeChild(a);
      }
    }); //Appending additionalControls

    controls.appendChild(additionalControls); //More button

    new ToggleButton('more', player, controls, '');
    player.on('amst__more-click', function (b) {
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

    container.insertAdjacentHTML('beforeend', "<div class=\"amst__error\"><p>".concat(params.errorMessage, "</p></div>"));
    /**
     * Context menu is just a link showed on contextmenu event 
     * and then hidden when a click occurs outside it.
     * Since we don't like when things are too simple, we setup a small animation on the reveal.
     * This animation is done through a combination ot turbulence and displacementMap svg filters.
     * We play with the turbulence vertical baseFrequency parameter 
     * which is decreased from 0.3 (distortion) to 0 (flat).
     */

    container.insertAdjacentHTML('beforeend', "<div class=\"amst__contextmenu\"><a href=\"http://onfaitdessites.fr\" target=\"_blank\">AmstramgramMediaPlayer<br>by onFaitDesSites</a></div>");
    var animIsRunning = false,
        //setTimeout to clean the context menu style properties (position and filter) 
    //at the end of the opacity transition when it's hidden
    contextCleanStyleTimeout = null;
    $().on('contextmenu', function (e) {
      e.preventDefault(); //!e.offsetX means obsolete browsers

      if (!e.offsetX || animIsRunning) return;
      var r, //turbulence vertical baseFrequency parameter
      now; //timing reference to force a minimal 40ms interval between two calls to animationFrame

      if (!animIsRunning) {
        animIsRunning = true;
        r = 0.3;
        now = Date.now(); //the context menu position is set according to the event position

        var rect = self.boundingRect,
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
          left = (_readOnlyError("left"), '50%');
          transform = (_readOnlyError("transform"), 'translateX(-50%)');
        } //Show the context menu in the right position


        $('.amst__contextmenu').css({
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          transform: transform
        }).classList.add('amst__contextmenu-show'); //If necessary, cancel the timeout

        if (contextCleanStyleTimeout) clearTimeout(contextCleanStyleTimeout); //Launch the animation

        w$1.requestAnimationFrame(anim);
      }

      function anim() {
        //If less than 40ms since the previous call : wait...
        if (Date.now() - now < 40) {
          w$1.requestAnimationFrame(anim);
          return;
        }

        now = Date.now();
        r = Math.max(0, r - 0.03);
        $('.amst__contextmenu').css({
          filter: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0 ".concat(r, "' result='N' numOctaves='2' /><feDisplacementMap in='SourceGraphic' in2='N' scale='100' xChannelSelector='R' yChannelSelector='R'></feDisplacementMap></filter></svg>#n\")")
        });

        if (r > 0) {
          w$1.requestAnimationFrame(anim);
        } else {
          animIsRunning = false;
        }
      } //Wait for click, resize or scroll event to hide the context menu


      w$1.addEventListener('click', removeContext);
      player.on('amst__resize', removeContext);

      function removeContext() {
        w$1.removeEventListener('click', removeContext);
        player.off('amst__resize', removeContext);
        $('.amst__contextmenu').classList.remove('amst__contextmenu-show'); //Cleaning at the end of the opacity transition

        contextCleanStyleTimeout = setTimeout(function () {
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

    $().on('keydown', function (e) {
      //Adding the css class
      $().classList.add('amst__keyboard-active'); //Watching pointer's event

      w$1.addEventListener(params.pointermove, setKeyboardIsInactive, false);
      w$1.addEventListener(params.pointerdown, setKeyboardIsInactive, false);

      function setKeyboardIsInactive() {
        //Removing the css class
        $().classList.remove('amst__keyboard-active'); //Stop watching pointer's event

        w$1.removeEventListener(params.pointermove, setKeyboardIsInactive);
        w$1.removeEventListener(params.pointerdown, setKeyboardIsInactive);
      }

      if (e.which == 32) {
        //Space bar
        e.preventDefault();
        playPauseButton.button.focus();
        player.toggle();
      }
    }); //Media events

    media.on('loadedmetadata', function (_) {
      return $().classList.add('amst__loadedmetadata');
    }).on('play playing seeked canplay', function (_) {
      return $().classList.remove('amst__buffering');
    }).on('seeking waiting loadeddata', function (_) {
      return $().classList.add('amst__buffering');
    }).on('error', function (_) {
      if (media.networkState == 3) {
        //No HTMLMediaElement src found.
        player.pause();
        $().classList.remove('amst__buffering');
        $().classList.add('amst__show-error');
        player.emit('amst__error');
      }
    }); //Player events

    player.on('amst__src-change', function (_) {
      $().classList.remove('amst__loadedmetadata');
      $().classList.remove('amst__show-error');
      resize();
    }).on('amst__should-play', function (_) {
      return $().classList.add('amst__buffering');
    }).on('amst__play amst__should-play', function (_) {
      return playPauseButton.state = true;
    }).on('amst__pause', function (_) {
      return playPauseButton.state = false;
    }).on('amst__should-reset', function (_) {
      return _this.reset();
    });
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
      var playerWidth = self.boundingRect.width;

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
    w$1.addEventListener('amst__optimizedScrollResize', resize);
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


  _createClass(AudioUI, [{
    key: "reset",
    value: function reset() {
      var params = this.player.params,
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
  }]);

  return AudioUI;
}();

var _visible = new WeakMap();

//cSpell:words amst

/**
 * @class Nodal
 * @description Singleton 
 * Append a div <div class="amst__hidden" data-role="amst__nodal"></div> to the body
 * Called in audioUI
 * Used to display the available settings on screens whose width or height are less than 720px.
 */
var Nodal = /*#__PURE__*/function () {
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
  function Nodal() {
    _classCallCheck(this, Nodal);

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


  _createClass(Nodal, [{
    key: "show",
    value: function show(html) {
      this.container.innerHTML = html;
      this.container.classList.remove('amst__hidden');
      document.body.classList.add('amst__overflow-hidden');

      _classPrivateFieldSet(this, _visible, true);
    }
    /**
     * @method hide()
     * @description : empties container and hides the nodal
     */

  }, {
    key: "hide",
    value: function hide() {
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

  }, {
    key: "visible",
    get: function get() {
      return _classPrivateFieldGet(this, _visible);
    }
    /* -------------------------------------------------------------------------- */

    /*                                 END GETTER                                 */

    /* -------------------------------------------------------------------------- */

  }]);

  return Nodal;
}(); //Creating, freezing and exporting an unique instance


var nodal = new Nodal();
Object.freeze(nodal);

var w = window,
    s = w.sessionStorage,
    UA = w.navigator.userAgent.toLowerCase(),
    isIos = /ipad|iphone|ipod/i.test(UA) && !w.MSStream,
    isMobile = isIos || /android/i.test(UA),
    isIE = UA.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
/**
 * Class AmstramgramAudioPlayer.
 * @extends EventEmitter
 */

var _init = new WeakMap();

var _paused = new WeakMap();

var AmstramgramAudioPlayer = /*#__PURE__*/function (_EventEmitter) {
  _inherits(AmstramgramAudioPlayer, _EventEmitter);

  var _super = _createSuper(AmstramgramAudioPlayer);

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
  function AmstramgramAudioPlayer(media) {
    var _this;

    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments.length > 2 ? arguments[2] : undefined;
    var WrappingClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, AmstramgramAudioPlayer);

    //If the second argument is a function,
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    _this = _super.call(this); //If there is no media or if media is not an HTMLMediaElement, leaving...

    _init.set(_assertThisInitialized(_this), {
      writable: true,
      value: false
    });

    _paused.set(_assertThisInitialized(_this), {
      writable: true,
      value: true
    });

    if (!media || media.tagName != 'AUDIO' && media.tagName != 'VIDEO') return _possibleConstructorReturn(_this); //If WrappingClass is not provided, AmstramgramAudioPlayer is used as standalone 
    //and media must be an HTMLAudioElement. If not, leaving...
    else if (!WrappingClass && media.tagName != 'AUDIO') return _possibleConstructorReturn(_this); //If WrappingClass is provided but is not an AmstramgramMediaPlayer instance, leaving...
      else if (WrappingClass && WrappingClass.name != 'AmstramgramMediaPlayer') return _possibleConstructorReturn(_this); //If WrappingClass is provided but callback is not a function, leaving...
        else if (WrappingClass && (!callback || typeof callback != 'function')) return _possibleConstructorReturn(_this);
    var Class = _this.constructor,
        //AmstramgramAudioPlayer or AmstramgramVideoPlayer
    //myParams stores the parameters of the instance
    //Initially, it's just a clone af the class options
    myParams = clone(Class.options); //Time to begin HTML construction common to audio and video

    var $ = _$(document.createElement('div')); //This is our wrapper


    _$$($()); //Wrapper classes


    var classes = "amst__wrapper"; //Special css class for IE11 to prevent some transition bugs

    if (window.document.documentMode) classes += " amst__ie"; //See './tools/selector.js' for details and usage

    $().setAttributes({
      class: classes,
      'aria-label': "".concat(myParams.appLabel),
      role: 'application'
    }).insertAdjacentHTML('beforeend', "\n        <span class=\"amst__offscreen\">".concat(myParams.appLabel, "</span>\n        <div class=\"amst__container\" tabindex=\"0\">\n          <div class=\"amst__mediaelement\"></div>\n        </div>\n      "));
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


    Class.booleanAttributes.forEach(function (a) {
      //Parameters overrides HTML attributes
      params[a] = typeof params[a] === 'boolean' ? params[a] : media[a] == true ? true : undefined; //Removing attributes which don't need to be updated when src changes (autoplay).

      if (!Class.attributesToUpdate.includes(a)) media.removeAttribute(a);
    }); //Retrieving the string attributes

    Class.stringAttributes.forEach(function (a) {
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

    var ordered = {};
    Object.keys(myParams).sort().forEach(function (key) {
      ordered[key] = myParams[key];
    });
    _this.params = ordered;
    /* -------------------------------------------------------------------------- */

    /*                          POINTER EVENTS MANAGEMENT                         */

    /* -------------------------------------------------------------------------- */

    var self = _assertThisInitialized(_this);

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


    _classStaticPrivateFieldSpecGet(AmstramgramAudioPlayer, AmstramgramAudioPlayer, _players).push(_assertThisInitialized(_this)); //And build the UI


    _this._buildUI(); //Calling the setter src with the ordered parameters


    _this.src = _this.params;
    /** 
     *  AmstramgramAudioPlayer : 
     *    ["download", "next", "mute", "playPause", "previous"]
     *  AmstramgramVideoPlayer : 
     *    ["download", "next", "mute", "playPause", "previous", "fullscreen", "pip"]
    */

    _this.constructor.buttons.forEach(function (k) {
      Object.defineProperty(_assertThisInitialized(_this), k, {
        set: function set(opt) {
          var o = {};
          o[k] = opt;
          mergeDeep(_this.params, o);

          _this.emit("amst__".concat(k, "-should-update"));
        }
      });
    }); //Instance is initialized


    _classPrivateFieldSet(_assertThisInitialized(_this), _init, true); //Calling the callback


    if (callback && typeof callback === "function") {
      setTimeout(function (_) {
        callback.call(_assertThisInitialized(_this));

        if (_this.params.autoplay == true) {
          //Just to be sure that we let time to callback to execute
          setTimeout(function (_) {
            return self.play();
          }, 1);
        }
      }, 1);
    }

    return _this;
  }
  /* -------------------------------------------------------------------------- */

  /*                               END CONSTRUCTOR                              */

  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */

  /*                                   PRIVATE                                  */

  /* -------------------------------------------------------------------------- */


  _createClass(AmstramgramAudioPlayer, [{
    key: "_buildUI",
    value: function _buildUI() {
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

  }, {
    key: "init",
    get: function get() {
      return _classPrivateFieldGet(this, _init);
    }
    /** 
      @set currentTime
      @param {Number}
      @description set the media currentTime
    */

  }, {
    key: "currentTime",
    get:
    /** 
      @get currentTime
      @return {boolean}
      @description return the media currentTime
    */
    function get() {
      return this.params.media.currentTime;
    }
    /** 
      @set muted
      @param {boolean}
      @description If true, mute the volume. If not, unmute the volume
    */
    ,
    set: function set(t) {
      try {
        this.params.media.currentTime = t;
      } catch (e) {
        //IE11 throws an error if the media is not loaded
        console.warn(e);
      }
    }
  }, {
    key: "muted",
    get:
    /** 
      @get muted
      @return {boolean}
      @description return true if the volume is muted, false if not
    */
    function get() {
      return this.params.media.muted;
    }
    /** 
      @get paused
      @return {boolean}
      @description return true if the player is paused, false if not
    */
    ,
    set: function set(bool) {
      if (typeof bool == 'boolean') this.params.media.muted = bool;
    }
  }, {
    key: "paused",
    get: function get() {
      return _classPrivateFieldGet(this, _paused);
    }
    /** 
      @get playbackRate
      @return {number}
      @description return the media playbackRate
    */

  }, {
    key: "playbackRate",
    get: function get() {
      return this.params.media.playbackRate;
    }
    /** 
      @set playbackRate
      @param {number}
      @description set the media playbackRate
    */
    ,
    set: function set(rate) {
      this.params.media.playbackRate = rate;
    }
    /** 
      @get src
      @return {string}
      @description return the player src
    */

  }, {
    key: "src",
    get: function get() {
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
    ,
    set: function set(src) {
      this.pause();
      var params = this.params,
          media = params.media,
          type = params.type;

      try {
        //IE will fail
        this.params.media.currentTime = 0;
      } catch (e) {} //Not needed on first call since src = this.params


      if (this.init) {
        src = buildSrcParams(src, media);
        var mySrc = this.constructor.srcOptions;
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


      var rightSrc = params.src.find(function (el) {
        return el.quality && el.quality == s.getItem("amst__".concat(type, "DefaultQuality"));
      }) || params.src.find(function (el) {
        return el.default == true;
      }) || params.src[0]; //Updating the defaultQuality stored in sessionStorage

      if (rightSrc.quality && rightSrc.quality != s.getItem("amst__".concat(type, "DefaultQuality"))) {
        s.setItem("amst__".concat(type, "DefaultQuality"), rightSrc.quality);
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

      this.constructor.attributesToUpdate.forEach(function (a) {
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

  }, {
    key: "volume",
    get: function get() {
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
    ,
    set: function set(vol) {
      var _this2 = this;

      if (isNaN(vol) || vol < 0 || vol > 1 || vol == this.volume || this.params.isMobile && vol != 0 && vol != 1) return;
      var params = this.params,
          media = params.media;

      if (vol > 0) {
        media.volume = vol;
        if (media.muted) media.muted = false;
      }

      if (vol == 0 && !media.muted) media.muted = true; //Send new volume to the players of the same volumeGroup

      AmstramgramAudioPlayer.players.filter(function (p) {
        return p != _this2 && p.params.volumeGroup == params.volumeGroup && p.volume != vol;
      }).forEach(function (p) {
        return p.volume = vol;
      });
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

  }, {
    key: "hideControls",
    value: function hideControls() {
      return;
    }
    /**
     * @method pause()
     * @description : pauses the player
     */

  }, {
    key: "pause",
    value: function pause() {
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

  }, {
    key: "play",
    value: function play() {
      if (this.paused && this.src) {
        var self = this;

        if (this.params.media.paused) {
          if (AmstramgramAudioPlayer.currentPlayer && this != AmstramgramAudioPlayer.currentPlayer) {
            AmstramgramAudioPlayer.currentPlayer.pause();
            AmstramgramAudioPlayer.currentPlayer.emit('amst__should-reset');
          }

          _classPrivateFieldSet(this, _paused, false);

          this.emit('amst__should-play');
          var media = this.params.media;

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
            var playPromise = media.play();

            if (playPromise !== undefined) {
              playPromise.then(playSucceed).catch(function (e) {
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

  }, {
    key: "showControls",
    value: function showControls() {
      return;
    }
    /**
     * @method toggle()
     * @description : Toggles the playback
     */

  }, {
    key: "toggle",
    value: function toggle() {
      if (this.paused) {
        this.play();
      } else {
        this.pause();
      }
    }
    /* -------------------------------------------------------------------------- */

    /*                             END PUBLIC METHODS                             */

    /* -------------------------------------------------------------------------- */

  }], [{
    key: "booleanAttributes",
    get:
    /* -------------------------------------------------------------------------- */

    /*                               INTERNAL UTILS                               */

    /* -------------------------------------------------------------------------- */

    /**
     * @getter booleanAttributes
     * @returns {Array}
     * @description returns the list of the HTML audio element boolean attributes 
     * that we have to treat on initialization.
     */
    function get() {
      return ['autoplay', 'loop'];
    }
    /**
     * @getter stringAttributes
     * @returns {Array}
     * @description returns the list of the HTML audio element string attributes 
     * that we have to treat on initialization.
     */

  }, {
    key: "stringAttributes",
    get: function get() {
      return ['crossOrigin', 'preload', 'type'];
    }
    /**
     * @getter attributesToUpdate
     * @returns {Array}
     * @description returns the list of the HTML audio element attributes 
     * that we have to update when src changes.
     */

  }, {
    key: "attributesToUpdate",
    get: function get() {
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

  }, {
    key: "buttons",
    get: function get() {
      var _this3 = this;

      return Object.keys(this.srcOptions).filter(function (k) {
        return isObject(_this3.srcOptions[k]) && (_this3.srcOptions[k].hasOwnProperty('label') || _this3.srcOptions[k].hasOwnProperty('hidden'));
      });
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

  }, {
    key: "instanceOptions",
    get:
    /** 
     * @get instanceOptions
     * @returns {Object}
     * @description return the current options for new instances
    */
    function get() {
      return clone(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _instanceOptions));
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

  }, {
    key: "srcOptions",
    get:
    /** 
     * @get srcOptions
     * @returns {Object}
     * @description return the current options for new audio src
    */
    function get() {
      return clone(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _srcOptions));
    }
    /** 
     * @set options
     * @param {Object} opt
     * @description : set the default options of the class.
    */

  }, {
    key: "options",
    get:
    /** 
     * @get options
     * @returns {Object}
     * @description : return the default options of the class.
    */
    function get() {
      return _objectSpread2(_objectSpread2({}, this.instanceOptions), this.srcOptions);
    }
    /* -------------------------------------------------------------------------- */

    /*                                 END OPTIONS                                */

    /* -------------------------------------------------------------------------- */

    /**
     * @private #players
     * @type {Array}
     * @description store the audio player instances
     */
    ,
    set: function set(opt) {
      new Array(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _instanceOptions), _classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _srcOptions)).forEach(function (obj) {
        mergeDeep(obj, opt);
      });
    }
  }, {
    key: "players",
    get:
    /** 
     * @get players
     * @returns {Array}
     * @description : Returns a clone of the private field #players array.
    */
    function get() {
      return _toConsumableArray(_classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _players));
    }
    /** 
     * @private #currentPlayer
     * @typeof {AmstramgramAudioPlayer} 
     */

  }, {
    key: "currentPlayer",
    get:
    /** 
     * @get currentPlayer
     * @returns {AmstramgramAudioPlayer|undefined}
     * @description : Returns the current player or undefined if there is none.
    */
    function get() {
      return _classStaticPrivateFieldSpecGet(this, AmstramgramAudioPlayer, _currentPlayer);
    }
    /* -------------------------------------------------------------------------- */

    /*                               PRIVATE FIELDS                               */

    /* -------------------------------------------------------------------------- */

  }]);

  return AmstramgramAudioPlayer;
}(EventEmitter);

var _instanceOptions = {
  writable: true,
  value: AudioDefaultOptions.instance
};
var _srcOptions = {
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

module.exports = AmstramgramAudioPlayer;
