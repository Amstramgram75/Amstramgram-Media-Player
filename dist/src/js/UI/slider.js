//cSpell:words amstramgram amst tabindex beforeend

import EventEmitter from '../tools/eventEmitter.js'
import { _$ } from '../tools/selector.js'

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
export default class Slider extends EventEmitter {
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
    super()

    //Slider HTML insertion
    ui.insertAdjacentHTML('beforeend', `
      <div class="amst__slider" aria-valuemin="0" aria-valuemax="1" role="slider" tabindex="0">
        <div class="amst__slider-total">
          <div class="amst__slider-current"></div>
        </div>
      </div>
    `)

    const
      self = this,
      $ = _$(ui.querySelector('.amst__slider')),
      params = player.params


    //Instance properties used only by inherited classes
    this.params = params
    this.slider = $()
    this.total = $('.amst__slider-total')
    this.current = $('.amst__slider-current')
    this.referenceRect = this.total.getBoundingClientRect()
    this.slider.on('focus', _ => player.emit('amst__focus'))//Show videoUI controls 

    //If reactiveArea is not specified, it's set to the slider itself
    reactiveArea = reactiveArea || $()

    //Getting the reference position/dimension. 
    //Those data change on scroll and resize events unified and throttled by the amst__resize event.
    player.on('amst__resize', referenceRectUpdate)

    //But vertical sliders are hidden by default, so we have to wait for mouseenter event.
    if (vertical) reactiveArea.on(params.pointerenter, referenceRectUpdate)
    //Getting the reference position/dimension on player initialization
    params.media.on('loadedmetadata', referenceRectUpdate)

    //Pointer events listeners
    function pointerdown(e) {
      const
        ref = self.referenceRect,
        cleanEvents = ('pointerId' in e) ? `${params.pointerup}` : `${params.pointerleave} ${params.pointerup}`
      if ('pointerId' in e) reactiveArea.setPointerCapture(e.pointerId)
      //Get the ratio between the coordinates of the pointer position relative to the reference
      function getRatio(e) {
        let ratio
        const
          x = e.clientX || e.pageX - window.pageXOffset,
          y = e.clientY || e.pageY - window.pageYOffset
        if (x && y) {
          if (vertical) {
            ratio = y - ref.top
            ratio = 1 - (ratio / ref.height)
          } else {
            ratio = x - ref.left
            ratio = ratio / ref.width
          }
          //Ensure that ratio is between 0 and 1
          ratio = Math.max(0, Math.min(ratio, 1))
          //Emit the event
          self.emit('amst__slider-change', ratio)
        }
      }
      getRatio(e)
      function clean() {
        reactiveArea
          .off(`${params.pointermove} ${params.pointerup}`, getRatio)
          .off(cleanEvents, clean)
      }
      //As soon as pointer is down, we watch for move and up to get ratio changes
      //On leave and up, we stop watching
      reactiveArea
        .on(`${params.pointermove} ${params.pointerup}`, getRatio)
        .on(cleanEvents, clean)
    }
    //Start listening on pointerdown event
    reactiveArea.on(params.pointerdown, pointerdown)

    function referenceRectUpdate() {
      //Timer to be sure to get right dimensions when entering fullscreen
      //On Chrome, if no timer, 
      //self.total.getBoundingClientRect().width = 0 
      //when entering fullscreen
      setTimeout(_ => { self.referenceRect = self.total.getBoundingClientRect() }, 1)
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */
}
