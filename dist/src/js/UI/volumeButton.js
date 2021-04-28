//cSpell:words amstramgram amst tabindex valuenow valuetext beforeend

import MuteButton from './muteButton.js'
import VolumeSlider from './volumeSlider.js'

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

export default class VolumeButton extends VolumeSlider {
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
    const
      params = player.params,
      volumeOrientation = (params.volumeHorizontal !== true) ? ' amst__vertical' : ''
    // volumeOrientation = (params.volumeOrientation == 'vertical') ? ' amst__vertical' : ''

    //Volume wrapper HTML insertion
    ui.insertAdjacentHTML('beforeend', `<div class="amst__volume${volumeOrientation}"><div class="amst__volume-wrapper"></div></div>`)

    const wrapper = ui.querySelector('.amst__volume-wrapper')

    //Mute button HTML insertion
    const muteButton = new MuteButton(player, wrapper)

    //volumeSlider instantiation
    super(
      player,
      wrapper,
      (volumeOrientation == ' amst__vertical')
    )

    //Prevent change of the volumeHorizontal parameter
    Object.defineProperty(params, 'volumeHorizontal', { writable: false })

    /**
     * On not mobile device with touchscreen, we have to allow volume adjustment.
     * So we need to set up a special mechanism for vertical volume button.
     * A simple tap on loudspeaker icon will show/hide the slider after a 250ms delay.
     * The slider appears when we attribute it the amst__show class.
     * A double tap will toggle the button state.
     * A double tap is defined as two successive taps in less than 250ms.
     */

    const slider = this.slider
    let
      //Timeout used to hide the slider after the delay given by the instance parameter hideControlsDelay
      hideSliderTimeout = false,
      //Timeout used to confirm simple tap
      clickTimeout = false,
      //clickTimeout duration
      delay = 250,
      //Store the first tap timestamp
      timeNow = 0

    //Hides the slider after the delay given by the instance parameter hideControlsDelay 
    function hideSlider() {
      //Only if necessary...
      if (params.volumeOrientation == 'vertical' && !params.isMobile && params.currentPointerType != 'mouse') {
        if (hideSliderTimeout) clearTimeout(hideSliderTimeout)
        hideSliderTimeout = setTimeout(_ => {
          hideSliderTimeout = false
          slider.classList.remove('amst__show')
        }, params.hideControlsDelay)
      }
    }

    //Reset the hideSliderTimeout when volume changes
    params.media.on('volumechange', hideSlider)

    if (params.volumeOrientation == 'vertical') {
      //Hides the slider if main video controls are hidden
      if (params.type == 'video') {
        player.on('amst__controlsAreHidden', _ => {
          if (params.currentPointerType != 'mouse') slider.classList.remove('amst__show')
        })
      }
      muteButton.button.addEventListener(params.pointerdown, _ => {
        //Only if necessary...
        if (params.currentPointerType != 'mouse') {
          //Canceling the hideSliderTimeout timer
          if (hideSliderTimeout) clearTimeout(hideSliderTimeout)
          //If first tap
          if (timeNow == 0) {
            //Stores the timestamp
            timeNow = Date.now()
            //Set up the clickTimeout timer
            clickTimeout = setTimeout(_ => {
              //Reset
              timeNow = 0
              slider.classList.toggle('amst__show')
              if (slider.classList.contains('amst__show')) {
                //Delayed the slider hiding
                hideSlider()
                //The amst__optimizedScrollResize event allow to re-calculate the slider position
                window.dispatchEvent(new Event('amst__optimizedScrollResize'))
              }
            }, delay)
            //Second tap
            //If timeNow != 0, that is to say that the clickTimeout timer is still pending.
            //So, it's a double tap !
          } else {
            //Reset all
            clearTimeout(clickTimeout)
            clearTimeout(hideSliderTimeout)
            timeNow = 0
            //Toggle the button state
            muteButton.toggle()
            //Hides the slider
            slider.classList.remove('amst__show')
          }
        }
      })
    }
  }
}