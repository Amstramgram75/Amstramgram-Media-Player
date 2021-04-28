//cSpell:words amstramgram amst tabindex beforeend volumegroup

import ToggleButton from './toggleButton.js'

/**
 * Class MuteButton.
 * @extends ToggleButton
 * @extends Button
 * 
 * @HTML :
 *  <button type="button" class="amst__mute" tabindex="0"><div class="amst__svg-background"></div></button>
 * @description : 
 *  Mute/unmute the volume on click on mobile devices or if the volume is horizontal or if mouse is used.
 *  Keyboard shortcut: m
 *  - Listens to the 'volumechange' media event to 
 *      update the sessionStorage data and its state (on/off) if needed.
 *  - Listens to the 'amst__src-change' event emit by the player when a src is set 
 *      to store the volume data in sessionStorage if it doesn't exist yet 
 *      or if the volumeForced parameter is set to true
 */

export default class MuteButton extends ToggleButton {
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
   * @method update() : 
   *  - updates the button properties (label/disabled/hidden/tooltip) by calling super
   *  - emit a amst_ui-should-resize event if the disabled attribute of the button changes
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__mute-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * METHOD
   * @method toggle() : 
   * @description : toggles the button state
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   */
  constructor(player, ui) {
    //Call the toggleButton constructor
    super('mute', player, ui)

    const
      playerParams = player.params,
      storage = window.sessionStorage

    if (playerParams.isMobile) playerParams.volumeBeforeMute = 1

    //Listening to volumechange event to update the button state
    playerParams.media.on('volumechange', _ => {
      const v = player.volume
      //Updating storage
      storage.setItem(`amst__volumegroup${playerParams.volumeGroup}`, v)
      //Updating volumeBeforeMute if possible
      if (v > 0.1 && !playerParams.isMobile) playerParams.volumeBeforeMute = v
      this.state = player.muted
    })

    player
      .on('amst__src-change', _ => {
        if (playerParams.volumeForced === true || !storage.getItem(`amst__volumegroup${playerParams.volumeGroup}`)) {
          storage.setItem(`amst__volumegroup${playerParams.volumeGroup}`, playerParams.volume)
          //If not and if there is already a relevant value stored :
        } else if (storage.getItem(`amst__volumegroup${playerParams.volumeGroup}`)) {
          //this value is set to the volume
          playerParams.volume = Number(storage.getItem(`amst__volumegroup${playerParams.volumeGroup}`))
        }
        player.volume = playerParams.volume
        this.state = player.muted
      })
      .on('amst__mute-click', _ => {
        if (playerParams.isMobile || playerParams.currentPointerType == 'mouse' || playerParams.volumeOrientation == 'horizontal') {
          this.toggle()
        }
      })

    //Keyboard events
    playerParams.$().on('keydown', e => {
      if (this.params.disabled || this.params.hidden || e.which != 77) return
      e.preventDefault()
      this.toggle()
      //Reset focus to force the amst__focus event
      this.button.blur()
      this.button.focus()
    })
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   METHODS                                  */
  /* -------------------------------------------------------------------------- */
  update() {
    const p = this.player.params
    if (!p.isMobile) {
      if (this.params.hidden == true) {
        p.$('.amst__volume').classList.add('amst__hidden')
      } else {
        p.$('.amst__volume').classList.remove('amst__hidden')
      }
    }
    super.update()
  }

  /**
   * @method toggle()
   * @description : toggles the button state
   */
  toggle() {
    this.state = !this.state
    this.player.volume = this.state ? 0 : this.player.params.volumeBeforeMute
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END METHOD                                 */
  /* -------------------------------------------------------------------------- */
}
