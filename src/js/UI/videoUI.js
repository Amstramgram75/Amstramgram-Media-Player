//cSpell:words amstramgram amst mozfullscreenchange beforeend tabindex seekings isfullscreen enterpictureinpicture leavepictureinpicture


import AudioUI from './audioUI.js'
import PipButton from './pipButton.js'
import FullscreenButton from './fullscreenButton.js'
import { secondsToTimeCode } from '../tools/utils.js'

const s = window.sessionStorage


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

export default class VideoUI extends AudioUI {
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
    return !s.hasOwnProperty('amst__hideTouchSeekingInfo')
  }

  /**
   * @function hideTouchSeekingInfo
   * @description called when the user has tapped after an horizontal touch swipe
   * Remove the touch seeking info in all video players
   */
  static hideTouchSeekingInfo() {
    if (s.hasOwnProperty('amst__hideTouchSeekingInfo')) return
    //Store the value for future players
    s.setItem('amst__hideTouchSeekingInfo', 'true')
    //Apply to all the already created video players
    this.videoUIs.forEach(ui => {
      const $ = ui.player.params.$
      $('.amst__layer-overlay').removeChild($('.amst__layer-overlay .amst__seeking-touch-info'))
    })
  }

  //Private static array storing the VideoUI instances
  static #videoUIs = []

  /** 
    @get videoUIs
    @returns {Array}
    @description :
      Returns a clone of the private field #videoUIs array.
  */
  static get videoUIs() { return [...this.#videoUIs] }

  /**
   * CONSTRUCTOR
   * @param {AmstramgramVideoPlayer} player - AmstramgramVideoPlayer instance
   */
  constructor(player) {
    const
      params = player.params,
      media = params.media,
      $ = params.$,
      $$ = params.$$,
      container = $('.amst__container')

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
      `
    if (VideoUI.showTouchSeekingInfo === true) {
      layersHtml += `
          <div class="amst__seeking-touch-info">
            <span>${params.touchSeekingInfoText}</span>
          </div>
        `
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
    `
    container.insertAdjacentHTML('beforeend', layersHtml)
    /* -------------------------------------------------------------------------- */
    /*                           END BUILDING THE LAYERS                          */
    /* -------------------------------------------------------------------------- */

    super(player)

    const
      w = window,
      d = document,
      layerPoster = $('.amst__layer-poster'),
      layerPosterCanvas = $('.amst__layer-poster canvas'),
      layerPlay = $('.amst__layer-play'),
      layerOverlay = $('.amst__layer-overlay'),
      seekingTouchCover = $('.amst__seeking-touch-cover'),
      seekingTouchWrapper = $('.amst__seeking-touch-wrapper'),
      controls = $('.amst__controls'),
      timeSlider = this.timeSlider,
      seekings = $$('.amst__seeking'),
      self = this

    //PIP button if PIP is supported
    if ('pictureInPictureEnabled' in d) new PipButton(player, $('.amst__additional-controls'))

    //Fullscreen button
    new FullscreenButton(player, controls)


    //Mouse click on the overlay layer toggles the media playback.
    //If the pointer is not mouse and the controls are hidden (media is playing),
    //the first tap shows the controls. A second one pauses the media.
    //This behaviour is canceled when horizontal swipe is detected.
    layerOverlay.on('click', toggle)
    function toggle() {
      if (params.currentPointerType == 'mouse' || !controlsAreHidden) {
        player.toggle()
      } else {
        showControls()
      }
    }

    //Media events
    media
      .on('loadedmetadata', _ => {
        params.format = media.videoWidth / media.videoHeight
        container.style.paddingBottom = 1 / params.format * 100 + '%'
        player.emit('amst__should-resize')
      })
      .on('seeked', () => {
        //The event is dispatched when media ended.
        //In this case, we display the poster.
        if (media.currentTime == 0 && media.paused) {
          layerPosterCanvas.width = 0
          layerPosterCanvas.height = 0
          layerPoster.classList.remove('amst__hidden')
          media.on('timeupdate', function hidePoster() {
            media.off('timeupdate', hidePoster)
            layerPoster.classList.add('amst__hidden')
          })
          //If seeking is caused by horizontal swipe
        } else if (params.currentPointerType != 'mouse') hideControls(true)
      })
      .on('playing volumechange', () => {
        if (params.currentPointerType != 'mouse') hideControls(true)
      })

    //Player events
    player
      .on('amst__play amst__should-play', _ => {
        layerPlay.classList.add('amst__hidden')
        layerPoster.classList.add('amst__hidden')
        if (!controlsAreHidden) hideControls(true)
      })
      .on('amst__pause', _ => {
        layerPlay.classList.remove('amst__hidden')
        showControls()
      })
      .on('amst__focus amst__showControls', showControls)
      .on('amst__hideControls', hideControls)
      .on('amst__resize', resize)


    /****************************************
    * 
    *                  RESIZE
    * 
    *****************************************/
    //The function is also called after source changed and when entering in fullscreen
    let playerWidth//Needed for the thumbnail position on touch device
    function resize() {
      playerWidth = self.boundingRect.width
      //Adapt the big play and loading svg elements scale 
      //so their dimension equals 1/3 of the player height/width.
      //Natural svg dimension is 90px
      let scale = Math.min(playerWidth, self.boundingRect.height) * 0.3 / 90
      //scale must finally be constrained between 0.5 and 1
      scale = Math.max(0.4, Math.min(1, scale))
      if (scale == 1) {
        [...$$('.amst__layer-scale'), ...$$('.amst__layer-scale > div')].forEach(el => el.removeAttribute('style'))
      } else {
        $$('.amst__layer-scale').css({ height: `calc(100% - ${controls.css('height')}px` })
        $$('.amst__layer-scale > div').css({ transform: `scale(${scale})` })
      }
      //Sub font size adjustments
      let subFontSize = Math.round(24 * playerWidth / 1000)
      subFontSize = Math.min(Math.max(subFontSize, 14), 30) + 'px'
      $('.amst__subtitles-container').style.fontSize = subFontSize
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
      container.style.paddingBottom = 1 / params.format * 100 + '%'
      //Updating the poster
      if (params.poster) {
        layerPoster.style.backgroundImage = `url("${params.poster}")`
        layerPoster.classList.remove('amst__hidden')
      } else {
        layerPoster.removeAttribute('style')
        layerPoster.classList.add('amst__hidden')
      }
      const paramsThumbnails = params.thumbnails
      //Updating the thumbnails
      if (paramsThumbnails.src && paramsThumbnails.width > 0 && paramsThumbnails.int > 0) {
        const thumbnailsImage = new Image()
        function onThumbLoad(e) {
          thumbnailsImage.removeEventListener('load', onThumbLoad)
          thumbnailsImage.removeEventListener('error', onThumbLoad)
          if (e.type == 'load' && e.target.getAttribute('src') == paramsThumbnails.src) {//In case of src changes before img loads
            //If the thumbnails src is valid
            //add the 'amst__thumbnails' class to the wrapper
            $().classList.add('amst__thumbnails')
            //and define the style of the seeking container displaying the thumbnail
            const css = { width: `${paramsThumbnails.width}px`, height: `${thumbnailsImage.naturalHeight}px`, 'background-image': `url("${paramsThumbnails.src}")` }
            seekings.css(css)
            //Listening to the 'amst__move-over-time-slider' event to update the thumbnail displayed on pointer move events
            //No need to worry whether the listener is already set
            //By construction, the eventEmitter class prevents multiple identical callbacks
            timeSlider.on('amst__move-over-time-slider', updateThumbnails)
          } else {
            //If the thumbnails src is not valid
            removeThumbnails()
          }
        }
        thumbnailsImage.addEventListener('error', onThumbLoad, false)
        thumbnailsImage.addEventListener('load', onThumbLoad, false)
        thumbnailsImage.src = paramsThumbnails.src
      } else {
        removeThumbnails()
      }
      if (self.boundingRect) resize()
    })

    /**
     * @function updateThumbnails
     * @param {Number} ratio
     * @description : Update the thumbnail displayed on pointer move events (mousemove on time rail or touchmove on overlay layer)
     */
    function updateThumbnails(ratio) {
      const offset = params.thumbnails.width * Math.floor((ratio * media.duration) / params.thumbnails.int)
      seekings.css({ backgroundPositionX: - offset + 'px' })
    }

    //Cleaning if there is no thumbnails
    function removeThumbnails() {
      $().classList.remove('amst__thumbnails')
      timeSlider.off('amst__move-over-time-slider', updateThumbnails)
      seekings.forEach(el => el.removeAttribute('style'))
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
    let
      hideControlsTimeOut = false,//timer set when the hideControls function needs to be delayed
      pointerOverControls = false,
      controlsAreHidden = false

    //If no touch pointer is used, controls are shown when the pointer enters or moves on the player.
    //It the pointer is not over the controls, controls are then hidden after a delay given by the hideControlsDelay parameter.
    if (params.pointerEventsInterface != 'touch') {
      controls
        .on(params.pointerenter, _ => {
          if (params.currentPointerType == 'mouse') pointerOverControls = true
        })
        .on(params.pointerleave, _ => {
          if (params.currentPointerType == 'mouse') {
            hideControls(true)
            pointerOverControls = false
          }
        })
      layerOverlay.on(params.pointermove, _ => {
        if (params.currentPointerType == 'mouse') showControls()
      })
    }
    //Reset hideControlsTimeOut each time a pointerdown event is detected on controls
    controls.on(params.pointerdown, showControls)

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
        return
      } else if (
        delayed ||
        $().classList.contains('amst__buffering') ||
        pointerOverControls ||
        self.settingsButton.state//Controls should remain visible as long as settings button state is true
      ) {
        /*
          The delay is applied if the delayed parameter is set to true
          or if the media is buffering
          or if the pointer is over the controls
          or if the settings button state is on
        */
        //Reset timer
        if (hideControlsTimeOut) clearTimeout(hideControlsTimeOut)
        hideControlsTimeOut = setTimeout(hideControls, params.hideControlsDelay)
        //Only allow pan down : pan-up (scroll-down) will hide the controls
        layerOverlay.style.touchAction = 'pan-down'
      } else {//Hiding the controls
        if (hideControlsTimeOut) {
          clearTimeout(hideControlsTimeOut)
          hideControlsTimeOut = false
        }
        $()
          .off('keydown', hideControlsOnArrowDown)
          .on('keydown', showControlsOnArrowUp)
          .classList.add('amst__controls-hidden')
        //Only allow pan up : pan-down (scroll-up) will show the controls
        layerOverlay.style.touchAction = 'pan-up'
        controlsAreHidden = true
        player.emit('amst__controlsAreHidden')
      }
    }

    /**
     * @function showControls
     * @description : internal method to show the controls
     */
    function showControls() {
      if (hideControlsTimeOut) {
        clearTimeout(hideControlsTimeOut)
        hideControlsTimeOut = false
      }
      $()
        .on('keydown', hideControlsOnArrowDown)
        .off('keydown', showControlsOnArrowUp)
        .classList.remove('amst__controls-hidden')
      controlsAreHidden = false
      player.emit('amst__controlsAreVisible')
      if (!media.paused) {
        hideControls(true)
      } else {
        //Allow scroll
        layerOverlay.style.touchAction = 'auto'
      }
    }

    /**
     * @function showControlsOnArrowUp()
     * @params {Keyboard event}
     * @description : shows the controls when Arrow Up key is pressed with shift key
     */
    function showControlsOnArrowUp(e) {
      if (e.which == 38 && e.shiftKey) showControls()
    }

    /**
     * @function hideControlsOnArrowDown()
     * @params {Keyboard event}
     * @description : hides the controls when Arrow Down key is pressed with shift key
     */
    function hideControlsOnArrowDown(e) {
      if (e.which == 40 && e.shiftKey) hideControls()
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
      const threshold = 20//Minimum distance for a swipe detection
      let
        touchStartX,//event abscissa
        touchStartY,//event ordinate
        seekingWidth,//Width of the seeking touch wrapper (depends of thumbnails width or/and of media duration)
        timeRatio,//Ratio between currentTime and duration when horizontal swipe is detected
        ratio,//value given to the seekingTouchCover scaleX 
        controlsWereHidden = false,//Were the controls hidden when horizontal swipe was detected ?
        tapAndGoTimer//400ms timer set when horizontal swipe ends : if a click is detected during those 400ms, the media currentTime is updated

      layerOverlay.on('touchstart', e => {
        if (!media.duration || tapAndGoTimer) return
        seekingWidth = seekingTouchWrapper.offsetWidth
        touchStartX = e.changedTouches[0].clientX
        touchStartY = e.changedTouches[0].clientY
        layerOverlay.on('touchend touchcancel', onTouchEnd)
        layerOverlay.on('touchmove', onTouchMove)
      })

      function onTouchMove(e) {
        const
          distX = Math.abs(e.changedTouches[0].clientX - touchStartX),
          distY = Math.abs(e.changedTouches[0].clientY - touchStartY),
          playerLeftPosition = self.boundingRect.left
        if ((distX > threshold && distY < 0.25 * distX)//Horizontal swipe detected
          || ratio != undefined) {//Horizontal swipe in progress
          if (ratio == undefined) {//On horizontal swipe detection
            timeRatio = media.currentTime / media.duration
            //Store the controls bar state to restore it at the end of the movement
            controlsWereHidden = controlsAreHidden
            //Force the controls to be hidden if they are visible
            if (!controlsAreHidden) hideControls(false, true)
            //Show the layerOverlay children (seekingTouchCover and seekingTouchWrapper)
            layerOverlay.classList.add('amst__show')
          }
          //ratio calculation
          ratio = (e.changedTouches[0].clientX - playerLeftPosition) / playerWidth
          ratio = Math.min(Math.max(ratio, 0), 1)
          //Update the cover
          seekingTouchCover.style.transform = `scaleX(${ratio})`
          //Update time indicator
          $('.amst__seeking-touch-wrapper span').innerHTML = secondsToTimeCode(media.duration * ratio, (params.hoursTimeDisplay || media.duration > 3600))
          //Update the wrapper position
          //We manage so the wrapper stays inside the player
          let translate = (ratio * playerWidth) - (0.5 * seekingWidth)
          translate = Math.max(0, Math.min(playerWidth - seekingWidth, translate))
          seekingTouchWrapper.style.transform = `translateX(${translate}px)`
          //Update the thumbnail
          updateThumbnails(ratio)
        } else if (distY > threshold && distX < 0.25 * distY) {//Vertical swipe detected
          if (e.changedTouches[0].clientY > touchStartY) {
            if (!media.paused && !controlsAreHidden) hideControls()
          } else {
            if (controlsAreHidden) showControls()
          }
        }
      }

      function onTouchEnd(e) {
        layerOverlay.off('touchend touchcancel', onTouchEnd)
        layerOverlay.off('touchmove', onTouchMove)
        if (ratio != undefined) {//Ratio is defined only when horizontal swipe has occurred
          //Prevent toggle play on click
          layerOverlay.off('click', toggle)
          //Listen to the click event
          layerOverlay.on('click', onClick)
          function onClick() {//If click, set the playback head to the resulting time
            if (ratio != undefined) media.currentTime = media.duration * ratio
            //Remove the touche seeking info
            if (VideoUI.showTouchSeekingInfo) VideoUI.hideTouchSeekingInfo()
            //Restore original state
            clean()
          }
          //Set up the timer
          tapAndGoTimer = setTimeout(clean, 400)
          function clean() {
            //Cancel the timer
            clearTimeout(tapAndGoTimer)
            //Clear timer and ratio
            tapAndGoTimer = ratio = undefined
            //remove the click listener, restore the toggle on click and hide the seeking elements
            layerOverlay
              .off('click', onClick)
              .on('click', toggle)
              .classList.remove('amst__show')
            //If the controls were visible before the seeking, restore them; 
            if (!controlsWereHidden) showControls()
          }
        }
      }
    }
    //Update the touch seeking time indicator
    this.timeSlider.on('amst__time-slider-update', ratio => {
      $('.amst__seeking-time-display').style.transform = `scaleX(${ratio})`
    })
    /*************************************************
    * 
    *             END TOUCH EVENTS ON VIDEO
    * 
    **************************************************/
    VideoUI.#videoUIs.push(this)
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
    const
      media = this.player.params.media,
      layer = this.player.params.$('.amst__layer-poster'),
      canvas = this.player.params.$('.amst__layer-poster canvas')
    //Set the canvas dimensions
    canvas.width = media.videoWidth
    canvas.height = media.videoHeight
    //Draw the current frame in the canvas
    canvas.getContext('2d').drawImage(media, 0, 0, canvas.width, canvas.height)
    //Display the poster layer. The poster image is hidden by the canvas.
    layer.classList.remove('amst__hidden')
    super.reset()
  }
}
