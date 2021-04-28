//cSpell:words amstramgram amst currenttime beforeend afterbegin LOADEDBAR valuenow valuetext

import Slider from './slider.js'
import { secondsToTimeCode, throttle } from '../tools/utils.js'
import { _$ } from '../tools/selector.js'

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
export default class TimeSlider extends Slider {
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
    `)

    const $ = _$(ui.querySelector('.amst__time-slider'))

    //Insert the slider in the ui
    //Reactive area is set to the ui
    super(player, $(), false, $())
    $('.amst__slider').insertAdjacentHTML('afterbegin', `<span class="amst__offscreen">${player.params.timeSliderHelpText}</span>`)
    $('.amst__slider').setAttribute('aria-label', player.params.timeSliderLabel)

    //HTML adjustments
    this.total.insertAdjacentHTML('afterbegin', '<canvas class="amst__loaded-bar"></canvas>')
    this.total.insertAdjacentHTML('beforeend', `
      <div class="amst__buffering-bar"></div>
      <div class="amst__cursor"><div></div></div>
      <div class="amst__seeking-wrapper">
        <div class="amst__time amst__seeking">
          <span></span>
        </div>
      </div>
      <div class="amst__time-handler"></div>
    `)

    const
      self = this,
      params = this.params,
      media = params.media,
      wrapper = params.$(),
      slider = this.slider,
      current = this.current,
      handler = $('.amst__time-handler'),
      cursor = $('.amst__cursor'),
      seeking = $('.amst__seeking-wrapper'),
      seekingTime = $('.amst__seeking-wrapper span')

    let
      mustShowHours = params.alwaysShowHours,
      buffered,
      seekingOffset

    player.on('amst__src-change', _ => {
      //Remove the slider changes listener
      this.off('amst__slider-change', update)
      buffered = undefined
      seekingOffset = undefined
      updateDuration()
    })

    media
      .on('timeupdate', update)
      .on('progress', updateBuffer)
      .on('durationchange', updateDuration)
      .on('loadedmetadata', _ => this.on('amst__slider-change', update))
      .on('ended', _ => { media.currentTime = 0; player.pause() })

    function updateDuration() {
      if (media.duration) params.duration = media.duration
      mustShowHours = params.alwaysShowHours || params.duration >= 3600
      if (mustShowHours) {
        params.$$('.amst__time').forEach(el => el.classList.add('amst__long'))
      } else {
        params.$$('.amst__time').forEach(el => el.classList.remove('amst__long'))
      }
      params.$('.amst__currenttime').innerHTML = secondsToTimeCode(media.currentTime || 0, mustShowHours)
      params.$('.amst__duration').innerHTML = secondsToTimeCode(params.duration, mustShowHours)
      slider.setAttribute('aria-valuemax', params.duration)
      update(media.currentTime / params.duration)
    }


    //Left and right Arrows move the playback head by a step defined by the skipTime parameter.
    wrapper.on('keydown', (e) => {
      if ([37, 39].includes(e.which) && wrapper.classList.contains('amst__loadedmetadata')) e.preventDefault(); else return
      //Reset focus to force the amst__focus event
      slider.blur()
      slider.focus()
      //The skipTime parameter can be a percent or an integer
      const skipTime = (typeof (params.skipTime) == 'string' && params.skipTime.slice(-1) == '%') ? (parseInt(params.skipTime) * media.duration / 100) : parseInt(params.skipTime)
      switch (e.which) {
        case 37://Arrow Left
          media.currentTime = Math.max(0, media.currentTime - skipTime)
          break
        case 39://Arrow Right
          media.currentTime = Math.min(media.duration, media.currentTime + skipTime)
          break
      }
    }, false)



    /* -------------------------------------------------------------------------- */
    /*                            LOADEDBAR MANAGEMENT                            */
    /* -------------------------------------------------------------------------- */
    const
      loadedBar = $('.amst__loaded-bar'),
      ctxLoadedBar = loadedBar.getContext('2d')
    loadedBar.height = 0

    function updateBuffer() {
      //Setting the height attribute of the canvas and the fillStyle color on initialization
      if (!loadedBar.height) {
        loadedBar.height = loadedBar.offsetHeight
        ctxLoadedBar.fillStyle = loadedBar.css('color')
      }
      //If the present media TimeRanges is different from the one stored
      //we update the canvas
      if (!compareTimeRanges(media.buffered, buffered)) {
        ctxLoadedBar.clearRect(0, 0, loadedBar.width, loadedBar.height)
        let inc = loadedBar.width / media.duration
        for (let i = 0; i < media.buffered.length; i++) {
          let start = media.buffered.start(i) * inc,
            width = (media.buffered.end(i) * inc) - start
          new AmstRoundedRect(ctxLoadedBar, loadedBar.height, start, width)
        }
        buffered = media.buffered
      }
    }
    /* -------------------------------------------------------------------------- */
    /*                          END LOADEDBAR MANAGEMENT                          */
    /* -------------------------------------------------------------------------- */


    //Unless we're sure that the device only supports touch events,
    //we throttle the pointermove event and listening to it to update cursor and seeking elements positions  
    if (params.pointerEventsInterface != 'touch') throttle(params.pointermove, 'amst__optimizedPointerMove', $())
    $().on('amst__optimizedPointerMove', e => {
      if (!media.duration || (e.detail.pointerType && e.detail.pointerType == 'touch')) return
      //The seeking element indicates the media time corresponding to the pointer position.
      //The deal is to avoid that it goes beyond the cursor boundaries when this one reaches the slider edges
      //So we need to know its width and also these of the cursor
      //Those measures are made each time the media source changes .
      if (!seekingOffset) {//If not yet known
        const cursorInner = $('.amst__cursor>div')
        seekingOffset = 0.5 * seeking.css("width")
        seekingOffset -= parseInt(window.getComputedStyle(cursorInner, ':after').getPropertyValue("border-bottom-width"))
        seekingOffset -= (0.5 * cursorInner.css('width'))
      }
      //Getting the pointer horizontal position relative to the slider
      const x = e.detail.clientX || e.detail.pageX - window.pageXOffset
      let pos = x - this.referenceRect.left
      //The reactive area is much wider than the slider
      //And we must restrain the result
      pos = Math.max(Math.min(pos, this.referenceRect.width), 0)
      //Updating the time indicator
      const ratio = pos / this.referenceRect.width
      seekingTime.innerHTML = secondsToTimeCode(media.duration * ratio, mustShowHours)
      //the cursor position
      cursor.css({ transform: `translateX(${pos}px)` })
      //and the seeking position.
      //We manage so it does not overflow the slider
      pos = Math.max(pos, seekingOffset)
      pos = Math.min(pos, this.referenceRect.width - seekingOffset)
      seeking.css({ transform: `translateX(${pos}px)` })
      //For the video player on desktop, the pointer movement must update the thumb displayed
      //This event is eventually treated in the videoUI class
      if (params.type == 'video') this.emit('amst__move-over-time-slider', ratio)
    })

    /** 
     * @function update
     * @param {Number|Event} ratio 
     * @description : Update the slider components.
     * ratio is either:
     *    - a number given by slider changes listener.
     *    - the media timeupdate event.
     * We declare a updateTimeout to prevent the timeupdate function call as long as the slider is updated by the user
    */
    let updateTimeout, updateTimeRailAnimation
    function update(ratio) {
      cancelAnimationFrame(updateTimeRailAnimation)
      if (!params.duration) return
      if (typeof ratio === 'number' && ratio > 0) {//update is called by the slider change event
        //Suspend the media timeupdate event listener
        media.off('timeupdate', update)
        clearTimeout(updateTimeout)
        //Update the media currentTime
        media.currentTime = ratio * params.duration
        //Reactivate the media timeupdate event listener after 50ms
        updateTimeout = setTimeout(_ => media.on('timeupdate', update), 50)
      }
      //Update the slider components
      updateTimeRail()
      updateBuffer()
      const currentTime = media.currentTime
      //Update all the player current time indicators
      params.$$('.amst__currenttime').forEach(el => el.innerHTML = secondsToTimeCode(currentTime, mustShowHours))
      //Update the slider attributes
      slider.setAttributes({
        'aria-valuenow': currentTime,
        'aria-valuetext': secondsToTimeCode(currentTime)
      })
    }

    function updateTimeRail() {
      let ratio = media.currentTime / params.duration
      ratio = Math.max(0, Math.min(ratio, 1))
      current.style.transform = `scaleX(${ratio})`
      handler.style.transform = `translateX(${ratio * self.referenceRect.width}px)`
      if (params.type == 'video') self.emit('amst__time-slider-update', ratio)
      if (!media.paused) updateTimeRailAnimation = requestAnimationFrame(updateTimeRail)
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */
}

//http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html
class AmstRoundedRect {
  constructor(ctx, h, x, w) {
    let y = 0, r = 2;
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
    return false
  } else {
    for (let i = 0; i < t1.length; i++) {
      //Comparing recursively each TimeRanges items
      //If we find a difference, we stop and return false
      if (t1.start(i) != t2.start(i) || t1.end(i) != t2.end(i)) {
        i = t1.length
        return false
      }
    }
  }
  return true
}