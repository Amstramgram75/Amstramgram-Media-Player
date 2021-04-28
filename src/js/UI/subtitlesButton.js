//cSpell:words amstramgram amst tabindex enterpictureinpicture leavepictureinpicture

import ToggleButton from './toggleButton.js'


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
export default class SubtitlesButton extends ToggleButton {
  /**
   * PRIVATE
   * @private {Boolean} #init - Pass to true after the first #buildTextTracks() call
   */
  #init = false

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
    super('subtitles', player, ui)

    const
      params = this.params,
      media = this.media = player.params.media

    if (params.sources.length == 0) {//No subtitles src in parameters
      //Retrieve the HTML subtitles tracks and build the params.sources array
      const
        subsSources = [],
        tracks = player.params.$$('track[src][srclang][label]', media)
      if (tracks.length > 0) {
        tracks.forEach(t => {
          subsSources.push({
            src: t.src,
            srclang: t.srclang,
            label: t.label
          })
          if (t.default && !params.default) params.default = t.srclang
        })
      }
      params.sources = subsSources
    }

    player.on('amst__src-change', _ => this.#buildTextTracks())

    player.on('amst__subtitles-click', _ => this.state = !this.state)
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
  #buildTextTracks() {
    if (this.#init && this.params.sources.length == 0) {
      this.player.params.$$('track[kind="subtitles"]').forEach(t => t.remove())
    }
    if (this.params.sources.length == 0 || !this.wrapper || !this.container) return

    const params = this.params

    //Sort the sources according to the srclang key alphabetical order
    sortArray(params.sources)

    let html = ''
    //Retain only the sources with src, srclang and label properties and write the html
    params.sources.filter(s => isString(s.src) && isString(s.srclang) && isString(s.label)).forEach(s => {
      html += `<track kind="subtitles" src="${s.src}" srclang="${s.srclang}" label="${s.label}" type="text/vtt">`
    })
    //Insert the result
    this.media.innerHTML = html

    this.wrapper.classList.add('amst__subtitles-empty')

    let activeTrack = null
    const textTracks = this.media.textTracks
    for (let i = 0; i < textTracks.length; i++) {
      const t = textTracks[i]
      t.mode = 'disabled'
      t.addEventListener("cuechange", _ => {
        this.container.innerHTML = ''
        if (t.activeCues.length > 0) this.container.appendChild((t.activeCues[0].getCueAsHTML()))
        if (this.container.innerHTML == '') {
          this.wrapper.classList.add('amst__subtitles-empty')
        } else {
          this.wrapper.classList.remove('amst__subtitles-empty')
        }
      })
      //Set the default track according to navigator language
      if (t.language == window.navigator.language || t.language.split('-')[0] == window.navigator.language.split('-')[0]) {
        activeTrack = t
      }
    }
    //If there is no track with navigator language, search a track 
    //whose language corresponds to that given by the default parameter.
    if (!activeTrack) {
      for (let i = 0; i < textTracks.length; i++) {
        const t = textTracks[i]
        if (t.language == params.default || t.language.split('-')[0] == params.default.split('-')[0]) {
          activeTrack = t
        }
      }
    }
    //If still no corresponding track found, set the first track active
    if (!activeTrack) activeTrack = textTracks[0]
    activeTrack.mode = 'hidden'
    this.#init = true
  }

  /* -------------------------------------------------------------------------- */
  /*                             STATE GETTER/SETTER                            */
  /* -------------------------------------------------------------------------- */
  /**
   * @getter
   * @return {Boolean}
   * @description : Return the button state
   */
  get state() {
    return super.state
  }

  /**
   * @setter
   * @param {Boolean} state
   * @description : Set the button state - hides/shows the subtitles
   *    
   */
  set state(state) {
    state = state && !this.params.hidden
    if (this.wrapper) {
      if (state) {//Show subs
        this.wrapper.classList.remove('amst__hide-subtitles')
      } else {//Hide subs
        this.wrapper.classList.add('amst__hide-subtitles')
      }
    }
    //The super.state setter call the update method
    super.state = this.params.state = state
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
    this.wrapper = null
    this.container = null
    const params = this.params
    try {
      this.wrapper = document.querySelector(params.wrapper)
      this.container = document.querySelector(params.container)
    } catch (e) {
      try {
        this.wrapper = this.player.params.$('.amst__subtitles-wrapper')
        this.container = this.player.params.$('.amst__subtitles-container')
      }
      catch (e) {
      }
    }
    //Hides the button if there is no textTrack
    params.hidden = params.hidden || params.sources.length == 0 || this.wrapper == null || this.container == null
    //The button's state parameter is forced to false if there is no subtitles tracks
    this.state = params.state
    super.update()
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
function isString(str) {
  return typeof str === 'string' && str != ''
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
    const valA = a[key].toUpperCase()
    const valB = b[key].toUpperCase()

    let comparison = 0
    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }
    return comparison;
  }
  try {
    return arr.sort(compare)
  } catch (e) {
    return arr
  }
  //return arr.sort(compare)
}