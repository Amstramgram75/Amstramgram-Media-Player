//cSpell:words amstramgram amst tabindex isfullscreen mozfullscreenchange

import ToggleButton from './toggleButton.js'

//Fullscreen API and prefix detection
const w = window,
  d = document,
  s = w.sessionStorage
let fullscreenAPI
if (s && s.getItem('amst_fullscreenAPI') != undefined) {
  fullscreenAPI = JSON.parse(s.getItem('amst_fullscreenAPI'))
} else {
  //https://github.com/sindresorhus/screenfull.js/
  //Prefix detection
  fullscreenAPI = (function () {
    let
      val,
      fnMap = [
        ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenchange'],
        // New WebKit
        ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitfullscreenchange'],
        // Old WebKit (Safari 5.1)
        ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitfullscreenchange'],
        ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozfullscreenchange'],
        ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'MSFullscreenChange']
      ],
      i = 0,
      l = fnMap.length,
      ret = {}
    for (; i < l; i++) {
      val = fnMap[i]
      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }
        return ret
      }
    }
    return { fake: true }//No Fullscreen API.
  })()
  if (s) s.setItem('amst_fullscreenAPI', JSON.stringify(fullscreenAPI))
}



/**
 * Class ToggleButton.
 * @extends ToggleButton
 * 
 * @HTML :
 * <div role="button" class="amst__fullscreen" tabindex="0"><div class="amst__svg-background"></div></div>
 */
export default class FullscreenButton extends ToggleButton {
  /**
   * @private {Boolean} #isFullscreen - passed to true if the player is in fullscreen mode
   */
  #isFullscreen = false

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
    super('fullscreen', player, ui)
    const
      self = this,
      playerParams = player.params,
      $ = playerParams.$,
      container = $('.amst__container'),
      //When entering fullscreen, nodal container is moved inside the wrapper
      //On leaving, it is moved back to body
      //Nodal displays the available settings on small screens (width or height less than 720px)
      nodal = playerParams.nodal

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
      if (this.state) {//Exit 
        if (fullscreenAPI.fake) {
          leaveFullscreen()
        } else {
          d[fullscreenAPI.exitFullscreen]()
        }
      } else {//Enter
        enterFullScreen()
      }
    })

    //Variables used to store the window scroll position before entering fullscreen
    //so we can restore them when exiting fullscreen
    let
      scrollX = 0,
      scrollY = 0
    function enterFullScreen() {
      scrollX = w.pageXOffset
      scrollY = w.pageYOffset
      if (fullscreenAPI.fake) {
        $().classList.add('amst__fake-fullscreen')
        //Escape touch will exit the fullscreen
        w.addEventListener('keydown', windowOnKeydown)
        self.#isFullscreen = true
      } else {
        $()[fullscreenAPI.requestFullscreen]()
      }
      d.body.classList.add('amst__overflow-hidden')
      $().appendChild(nodal.container)
      $().classList.add('amst__isfullscreen')
      self.state = true
      resizeFullScreen()
      player.on('amst__resize', resizeFullScreen)
      player.emit('amst__should-resize')
      player.emit('amst__fullscreen-enter')
    }

    /**
     * Called :
     *   - in fake mode, when the fullscreen button is clicked 
     *        or when escape touch is pressed during fullscreen state;
     *   - in real mode, on fullscreenchange event.
     */
    function leaveFullscreen() {
      player.off('amst__resize', resizeFullScreen)
      //Reset the fullscreen button
      self.state = false
      //Fake mode reset
      if (fullscreenAPI.fake) {
        $().classList.remove('amst__fake-fullscreen')
        w.removeEventListener('keydown', windowOnKeydown)
      }
      //Reset body, wrapper and container styles
      d.body.classList.remove('amst__overflow-hidden')
      container.setAttribute('style', `padding-bottom:${1 / playerParams.format * 100}%`)
      document.body.appendChild(nodal.container)
      $().classList.remove('amst__isfullscreen')
      //Restore the scroll position and resize
      setTimeout(_ => {
        w.scroll(scrollX, scrollY)
        player.emit('amst__should-resize')
        player.emit('amst__fullscreen-exit')
      }, 50)
    }

    //Listen to fullscreenchange event 
    d.addEventListener(fullscreenAPI.fullscreenchange, _ => {
      if (this.#isFullscreen) {//Exit
        //Reset the isFullscreen private property
        leaveFullscreen()
        this.#isFullscreen = false
      } else if (d[fullscreenAPI.fullscreenElement] == $()) {//The instance is in fullscreen state
        //Set the isFullscreen private property
        this.#isFullscreen = true
      }
    })

    //Called from the resize function : when window resizes, when entering in fullscreen and when source changes
    function resizeFullScreen() {
      //If screen ratio device is larger than video ratio
      if (w.innerWidth / w.innerHeight > playerParams.format) {
        container.css({
          width: w.innerHeight * playerParams.format + 'px',
          height: '100%',
          'paddingBottom': 0
        })
        //If screen ratio device is smaller than video ratio
      } else {
        container.css({
          width: '100%',
          height: 'auto',
          'paddingBottom': 1 / playerParams.format * 100 + '%'
        })
      }
    }

    //Used in fake mode to exit fullscreen state when escape touch is pressed
    function windowOnKeydown(e) {
      if (e.which != 27 || !fullscreenAPI.fake || !self.#isFullscreen) return
      leaveFullscreen()
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */
}