//cSpell:words amstramgram amst tabindex enterpictureinpicture leavepictureinpicture

import ToggleButton from './toggleButton.js'


/**
 * Class PipButton.
 * @extends ToggleButton
 * 
 * @HTML :
 * <div role="button" class="amst__pip" tabindex="0"><div class="amst__svg-background"></div></div>
 */
export default class PipButton extends ToggleButton {
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
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * according to the button state
   * AND
   * disabled the button if metadata have not yet been loaded
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__pip-click : dispatch on click - transmit the instance and the event
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
    super('pip', player, ui)

    const media = player.params.media

    //The button should be enabled only after metadata are loaded
    media
      .on('loadedmetadata', _ => {
        if (!this.params.disabled) this.button.removeAttribute('data-disabled')
      })
      .on('enterpictureinpicture', _ => this.state = true)
      .on('leavepictureinpicture', _ => this.state = false)

    player
      .on('amst__src-change', _ => {
        if (this.state) exitPIP()
        setTimeout(_ => this.button.setAttribute('data-disabled', true), 1)
      })
      .on('amst__pip-click', b => {
        if (b.state) {//Exit PIP
          exitPIP()
        } else {//Enter PIP
          media
            .requestPictureInPicture()
            .catch(_ => { })
        }
      })

    function exitPIP() {
      document
        .exitPictureInPicture()
        .catch(_ => { })
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   METHOD                                   */
  /* -------------------------------------------------------------------------- */
  /**
   * @method update()
   * @description : updates the button properties (label/disabled/hidden/tooltip) 
   * according to the button state
   * AND
   * disabled the button if metadata have not yet been loaded
   */
  update() {
    super.update()
    //The button is disabled if metadata have not yet been loaded
    if (!this.player.params.$().classList.contains('amst__loadedmetadata') && !this.params.disabled) this.button.setAttribute('data-disabled', true)
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END METHOD                                 */
  /* -------------------------------------------------------------------------- */
}

