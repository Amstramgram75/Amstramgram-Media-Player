/**
 * 
 * @param {String} events - Name of the events to throttle (separated by space)
 * @param {String} name 
 * @param {EventTarget} obj 
 */
export let throttle = (events, name, obj) => {
  if (typeof obj == 'undefined') {
    if (typeof window !== 'undefined') obj = window; else return
  }
  let
    running = false,
    func = (e) => {
      if (running) return
      running = true
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name, { detail: e }))
        running = false
      })
    }
  events.split(' ').forEach(event => obj.addEventListener(event, func))
}

/**
 * Return true if o is an Object
 * https://stackoverflow.com/a/37164538
 * Return true if o is an Object
 * @param {Object} o
 * @return {Boolean}
 */
export function isObject(o) {
  return (o && o.constructor === Object)
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
export function mergeDeep(target, source) {
  if (isObject(target) && Object.isFrozen(target)) return
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key])
      } else if (key in target
        && (typeof target[key] == typeof source[key] || target[key] === undefined)) {
        target[key] = source[key]
      }
    })
  }
}

/**
 * @function clone
 * @param {Object} o
 * @return {Object}
 * @description: returns the clone of an object and all of its keys
 */
export function clone(o) {
  const copy = {}
  Object.keys(o).forEach(key => {
    copy[key] = isObject(o[key]) ? clone(o[key]) : o[key]
  })
  return copy
}

/**
 * @function checkString
 * @param {string} s
 * @returns true if s is a non empty string / false if not
 */
function checkString(s) {
  return (typeof s === 'string' && s.length > 0)
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
    return [{ src: params }]
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
    return media.canPlayType(params.type) ? [params] : false
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
      const o = params[0]
      if (o.src && checkString(o.src)) {
        if (o.type) {
          if (media.canPlayType(o.type)) return params
          return false
        }
        return [{ src: o.src }]
      }
    }
    return params
      .filter(o => o.src && checkString(o.src) && o.quality && checkString(o.quality))
      .filter(o => !o.type || (o.type && media.canPlayType(o.type)))
  }
  return false
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
export function buildSrcParams(params, media, init = true) {
  let result = buildSrc(params, media)
  if (result) return { src: result }
  if (isObject(params)) {
    /**
     * new AmstramgramMediaPlayer('<audio>', {
     *  src: 'path_to_audio_file.mp3'
     *  duration: 125,
     * })
     */
    result = buildSrc(params.src, media)
    if (result) {
      params.src = result
      return params
    }
  }
  if (!init) {//Get the source(s) defined in HTML code
    let sources = []
    const sourcesTag = Array.from(media.querySelectorAll('source'))
    if (sourcesTag.length > 0) {
      sourcesTag.forEach(s => {
        let o = {}
        o.src = s.src
        if (s.getAttribute('data-quality')) o.quality = s.getAttribute('data-quality')
        if (s.getAttribute('type')) o.type = s.getAttribute('type')
        if (Boolean(s.getAttribute('data-default'))) o.default = Boolean(s.getAttribute('data-default'))
        sources.push(o)
        s.remove()
      })
    } else if (media.src && media.src != '') {
      sources.push({ src: media.src, type: media.getAttribute('type') })
    }
    result = buildSrc(sources, media)
    if (result) {
      params.src = result
      return params
    }
  }
  params.src = []
  return params
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
export function secondsToTimeCode(t, long = false) {
  if (isNaN(t)) {
    return long ? '00:00:00' : '00:00'
  }
  t = Math.round(t)
  let h = Math.floor(t / 3600),
    m = Math.floor((t - h * 3600) / 60),
    s = Math.round(t % 60)
  h = (h > 9) ? h + ':' : (h > 0) ? '0' + h + ':' : long ? '00:' : ''
  m = (m > 9) ? m : '0' + m
  s = (s > 9) ? s : '0' + s
  return h + m + ':' + s
}
