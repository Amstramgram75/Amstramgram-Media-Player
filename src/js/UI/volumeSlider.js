//cSpell:words amstramgram amst tabindex valuenow valuetext afterbegin

import Slider from './slider.js'

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
export default class VolumeSlider extends Slider {
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
    super(player, ui, vertical)
    const
      slider = this.slider,
      params = this.params,
      media = params.media,
      current = this.current

    //HTML adjustments
    slider.setAttribute('aria-label', player.params.volumeSliderLabel)
    slider.insertAdjacentHTML('afterbegin', `<span class="amst__offscreen">${player.params.volumeSliderHelpText}</span>`)

    //Keyboard events
    params.$().on('keydown', e => {
      //If the muteButton is operant
      if (params.mute.disabled !== true && params.mute.hidden !== true) {
        if ([38, 40].includes(e.which) && !e.shiftKey) e.preventDefault(); else return
        //Reset focus to force the amst__focus event
        slider.blur()
        slider.focus()
        switch (e.which) {
          case 40://Arrow Down decreases the volume
            player.volume = Math.max(0, player.volume - 0.05)
            break
          case 38://Arrow Up increases the volume
            player.volume = Math.min(1, player.volume + 0.05)
            break
        }
      }
    }, false)

    //Update the player volume when slider changes
    this.on('amst__slider-change', vol => player.volume = vol)
    //on volume changes
    media.on('volumechange', update)
    //on player initialization
    player.on('amst__src-change', update)

    function update() {
      const v = Math.round(player.volume * 100)
      current.style.width = v + '%'
      slider.setAttributes({
        'aria-valuenow': v / 100,
        'aria-valuetext': v + '%'
      })
    }

    //Prevent change of the volumeSliderLabel and volumeHelpLabel parameters
    Object.defineProperty(params, 'volumeSliderLabel', { writable: false })
    Object.defineProperty(params, 'volumeSliderHelpText', { writable: false })
  }
}
