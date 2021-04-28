//cSpell:words amstramgram amst beforeend

import { throttle } from '../tools/utils.js'
import Button from './button.js'
import ToggleButton from './toggleButton.js'
import MuteButton from './muteButton.js'
import VolumeButton from './volumeButton.js'
import TimeSlider from './timeSlider.js'
import SubtitlesButton from './subtitlesButton.js'
import SettingsButton from './settingsButton.js'


/* -------------------------------------------------------------------------- */
/*                                    UTILS                                   */
/* -------------------------------------------------------------------------- */
//Throttle the resize event
throttle('resize scroll', 'amst__optimizedScrollResize')
/*
  WIDTH CALCULATION OF THE TIMING DISPLAY ELEMENTS
  Those widths depend of the browser and must be defined
  to get the exact position ot the elements.
  Wa measure those widths for durations :
  - inferior to one hour (displayed duration : 00:00).
  - superior or equal to one hour (displayed duration : 00:00:00).
*/
const
  w = window,
  d = document,
  s = w.sessionStorage
let 
  timeWidth, //Width for durations inferior to one hour.
  longTimeWidth //Width for durations superior or equal to one hour.
if (s.getItem('amst__timeWidth')) {
  //If sessionStorage is available and data already stored :
  timeWidth = s.getItem('amst__timeWidth')
  longTimeWidth = s.getItem('amst__longTimeWidth')
} else {
  const
    measureTime = d.createElement('div'),
    measureLongTime = d.createElement('div')
  //amst__measureTime class is identical to amst__time class
  //but set an absolute position.
  measureTime.classList.add('amst__measureTime')
  measureTime.innerHTML = '<span>00:00<span>'
  measureLongTime.classList.add('amst__measureTime')
  measureLongTime.innerHTML = '<span>00:00:00<span>'
  d.body.appendChild(measureTime)
  d.body.appendChild(measureLongTime)
  timeWidth = measureTime.offsetWidth + 2
  longTimeWidth = measureLongTime.offsetWidth + 2
  d.body.removeChild(measureTime);
  d.body.removeChild(measureLongTime);
  s.setItem('amst__timeWidth', timeWidth)
  s.setItem('amst__longTimeWidth', longTimeWidth)
}
//Resulting rules are inserted in the DOM
const style = d.createElement("style")
// WebKit hack
style.appendChild(d.createTextNode(""))
d.head.appendChild(style)
style.sheet.insertRule(`.amst__time>span{width:${timeWidth}px;`, 0)
style.sheet.insertRule(`.amst__time.amst__long>span{width:${longTimeWidth}px;`, 0)
//END WIDTH CALCULATION OF THE TIMING DISPLAY ELEMENTS

/* -------------------------------------------------------------------------- */
/*                                  END UTILS                                 */
/* -------------------------------------------------------------------------- */



/**
 * Class AudioUI.
 * @description Create the UI for AmstramgramAudioPlayer
 */
export default class AudioUI {
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
    const
      self = this,
      params = player.params,
      $ = params.$,
      $$ = params.$$,
      media = params.media,
      container = $('.amst__container'),
      controls = $(d.createElement('div'))

    this.player = player

    /* -------------------------------------------------------------------------- */
    /*                               BUILDING THE UI                              */
    /* -------------------------------------------------------------------------- */
    //Previous button
    new Button('previous', player, controls)

    //PlayPauseButton button
    const playPauseButton = new ToggleButton('playPause', player, controls)
    //Play button click event
    player.on('amst__playPause-click', button => button.state ? player.pause() : player.play())

    //Next button
    new Button('next', player, controls)

    //TimeSlider
    //Property so we can listen to its 'amst__move-over-time-slider' event in the inherited class videoUI
    this.timeSlider = new TimeSlider(player, controls)

    //Mute/Volume
    if (params.isMobile)
      new MuteButton(player, controls)
    else {
      new VolumeButton(player, controls)
    }

    /**
     * Adding a wrapper for additional controls.
     * It contains the subtitles button, the settings button and the download button.
     * In videoUI, it also contains the PIP button.
     * If the player width is less than the miniMaxWidth parameter and 
     * if the wrapper contains more than one visible button,
     * the latter is replaced by a "more" toggle button.
     */
    const additionalControls = $(d.createElement('div'))
    additionalControls.classList.add('amst__additional-controls')

    //Subtitles button
    new SubtitlesButton(player, additionalControls)

    //Settings button
    //this because we need to know its state in videoUI :
    //Controls should remain visible as long as its state is on
    this.settingsButton = new SettingsButton(player, additionalControls)

    //Download button
    new Button('download', player, additionalControls)
    player.on('amst__download-click', b => {
      if (!b.params.disabled) {
        const a = d.createElement('a')
        a.href = media.src
        a.download = decodeURI(media.src.substring(media.src.lastIndexOf('/') + 1))
        d.body.appendChild(a)
        a.click()
        d.body.removeChild(a)
      }
    })

    //Appending additionalControls
    controls.appendChild(additionalControls)

    //More button
    new ToggleButton('more', player, controls, '')
    player.on('amst__more-click', b => {
      b.state = !b.state
      if (b.state) {
        $().classList.add('amst__show-additional-controls')
      } else {
        $().classList.remove('amst__show-additional-controls')
      }
    })

    //Appending controls
    controls.classList.add('amst__controls')
    container.appendChild(controls)

    //Alert container.
    //Displays the message defined by the errorMessage parameter
    //if the media source is not found.
    container.insertAdjacentHTML('beforeend', `<div class="amst__error"><p>${params.errorMessage}</p></div>`)

    /**
     * Context menu is just a link showed on contextmenu event 
     * and then hidden when a click occurs outside it.
     * Since we don't like when things are too simple, we setup a small animation on the reveal.
     * This animation is done through a combination ot turbulence and displacementMap svg filters.
     * We play with the turbulence vertical baseFrequency parameter 
     * which is decreased from 0.3 (distortion) to 0 (flat).
     */
    container.insertAdjacentHTML('beforeend', `<div class="amst__contextmenu"><a href="http://onfaitdessites.fr" target="_blank">AmstramgramMediaPlayer<br>by onFaitDesSites</a></div>`)
    let
      animIsRunning = false,
      //setTimeout to clean the context menu style properties (position and filter) 
      //at the end of the opacity transition when it's hidden
      contextCleanStyleTimeout = null
    $().on('contextmenu', e => {
      e.preventDefault()
      //!e.offsetX means obsolete browsers
      if (!e.offsetX || animIsRunning) return
      let
        r,//turbulence vertical baseFrequency parameter
        now//timing reference to force a minimal 40ms interval between two calls to animationFrame
      if (!animIsRunning) {
        animIsRunning = true
        r = 0.3
        now = Date.now()
        //the context menu position is set according to the event position
        const
          rect = self.boundingRect,
          width = rect.width,
          height = rect.height,
          x = e.clientX || e.pageX - window.pageXOffset,
          y = e.clientY || e.pageY - window.pageYOffset,
          left = (x - rect.left) < 0.5 * width ? (x - rect.left + 5) + 'px' : 'unset',
          right = (x - rect.left) < 0.5 * width ? 'unset' : (rect.right - x + 5) + 'px',
          top = (y - rect.top) < 0.5 * height ? (y - rect.top + 10) + 'px' : 'unset',
          bottom = (y - rect.top) < 0.5 * height ? 'unset' : (rect.bottom - y + 10) + 'px',
          transform = 'none'
        //If the player width is too small, context menu is horizontally centered
        if (width < 450) {
          left = '50%'
          transform = 'translateX(-50%)'
        }
        //Show the context menu in the right position
        $('.amst__contextmenu').css({ left: left, right: right, top: top, bottom: bottom, transform: transform }).classList.add('amst__contextmenu-show')
        //If necessary, cancel the timeout
        if (contextCleanStyleTimeout) clearTimeout(contextCleanStyleTimeout)
        //Launch the animation
        w.requestAnimationFrame(anim)
      }
      function anim() {
        //If less than 40ms since the previous call : wait...
        if (Date.now() - now < 40) {
          w.requestAnimationFrame(anim)
          return
        }
        now = Date.now()
        r = Math.max(0, r - 0.03)
        $('.amst__contextmenu').css({ filter: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0 ${r}' result='N' numOctaves='2' /><feDisplacementMap in='SourceGraphic' in2='N' scale='100' xChannelSelector='R' yChannelSelector='R'></feDisplacementMap></filter></svg>#n")` })
        if (r > 0) {
          w.requestAnimationFrame(anim)
        } else {
          animIsRunning = false
        }
      }
      //Wait for click, resize or scroll event to hide the context menu
      w.addEventListener('click', removeContext)
      player.on('amst__resize', removeContext)
      function removeContext() {
        w.removeEventListener('click', removeContext)
        player.off('amst__resize', removeContext)
        $('.amst__contextmenu').classList.remove('amst__contextmenu-show')
        //Cleaning at the end of the opacity transition
        contextCleanStyleTimeout = setTimeout(() => {
          $('.amst__contextmenu').removeAttribute('style')
        }, 400);
      }
    })
    /* -------------------------------------------------------------------------- */
    /*                             END BUILDING THE UI                            */
    /* -------------------------------------------------------------------------- */

    //Set a keyboard event listener on the wrapper.
    //When keyboard is used, we add the amst__keyboard-active css class to the wrapper 
    //to applied the proper style to the focused control.
    //The class is removed as soon as we detect a relevant pointer event.
    $().on('keydown', (e) => {
      //Adding the css class
      $().classList.add('amst__keyboard-active')
      //Watching pointer's event
      w.addEventListener(params.pointermove, setKeyboardIsInactive, false)
      w.addEventListener(params.pointerdown, setKeyboardIsInactive, false)
      function setKeyboardIsInactive() {
        //Removing the css class
        $().classList.remove('amst__keyboard-active')
        //Stop watching pointer's event
        w.removeEventListener(params.pointermove, setKeyboardIsInactive)
        w.removeEventListener(params.pointerdown, setKeyboardIsInactive)
      }
      if (e.which == 32) {//Space bar
        e.preventDefault()
        playPauseButton.button.focus()
        player.toggle()
      }
    })

    //Media events
    media
      .on('loadedmetadata', _ => $().classList.add('amst__loadedmetadata'))
      .on('play playing seeked canplay', _ => $().classList.remove('amst__buffering'))
      .on('seeking waiting loadeddata', _ => $().classList.add('amst__buffering'))
      .on('error', _ => {
        if (media.networkState == 3) {//No HTMLMediaElement src found.
          player.pause()
          $().classList.remove('amst__buffering')
          $().classList.add('amst__show-error')
          player.emit('amst__error')
        }
      })

    //Player events
    player
      .on('amst__src-change', _ => {
        $().classList.remove('amst__loadedmetadata')
        $().classList.remove('amst__show-error')
        resize()
      })
      .on('amst__should-play', _ => $().classList.add('amst__buffering'))
      .on('amst__play amst__should-play', _ => playPauseButton.state = true)
      .on('amst__pause', _ => playPauseButton.state = false)
      .on('amst__should-reset', _ => this.reset())


    /* -------------------------------------------------------------------------- */
    /*                           SIZING THE CONTROLS BAR                          */
    /* -------------------------------------------------------------------------- */
    //Resize function adds/removes the amst_compact and amst__mini class
    //according to the player width and the compactMaxWidth and miniMaxWidth instance parameters
    function resize() {
      //For video, first call may return a null height
      if (container.getBoundingClientRect().height == 0) {
        setTimeout(resize, 1)
        return
      }
      self.boundingRect = container.getBoundingClientRect()
      let playerWidth = self.boundingRect.width
      if (playerWidth <= params.compactMaxWidth) {
        $().classList.add('amst__compact')
        if (
          //the amst__mini class is added if the player width is less than the miniMaxWidth parameter
          playerWidth <= params.miniMaxWidth &&
          //AND
          //if there is more than one visible button in the additional controls
          $$('.amst__additional-controls div[role=button]').length - $$('.amst__additional-controls div[role=button].amst__hidden').length > 1) {
          $().classList.add('amst__mini')
        } else {
          $().classList.remove('amst__mini')
        }
      } else {
        $().classList.remove('amst__mini')
        $().classList.remove('amst__compact')
      }
      player.emit('amst__resize')
    }
    //The 'amst__should-resize' event is dispatched by the buttons when their hidden parameter changes
    //We need to resize because the conditions for amst__mini class might have changed.
    //It's also dispatched after settings button has been updated.
    player.on('amst__should-resize', resize)
    w.addEventListener('amst__optimizedScrollResize', resize)
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
    const
      params = this.player.params,
      media = params.media,
      //Store the media currentTime
      //So, when the player starts again, the playback head is set to the right time
      resetTime = media.currentTime,
      //Store the media src
      currentSrc = media.src
    params.$().classList.remove('amst__loadedmetadata')
    params.$().classList.remove('amst__buffering')
    media.src = ''
    media.preload = 'none'
    media.autoplay = false
    //Force the media update. Loading of the original source is cancelled.
    media.load()
    //Restore the original source without preload (IE will persist in preloading but who cares ???)
    media.src = currentSrc
    //Set the currentTime.
    try {
      media.currentTime = resetTime//IE will fail
    } catch (e) {//so...
      media.addEventListener('loadedmetadata', function restoreCurrentTime() {
        media.removeEventListener('loadedmetadata', restoreCurrentTime)
        media.currentTime = resetTime
      })
    }
    this.player.emit('amst__reset')
  }
}