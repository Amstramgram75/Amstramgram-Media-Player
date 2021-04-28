//cSpell:words amstramgram amst tabindex beforeend

import Button from './button.js'


/**
 * Class ToggleButton.
 * @extends Button
 * 
 * @HTML :
    <div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>
 * @description : Used for Play, Mute, Subtitles, PIP and Fullscreen buttons.
 */
export default class ToggleButton extends Button {
  /**
   * PRIVATE
   * @private {Boolean} #state - Store the button state
   */
  #state = false

  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * GETTER/SETTER
   * @property {Boolean} state - get/set the Button state
   */

  /**
   * OVERRIDDEN METHOD
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * according to the button state
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__name-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {String} name - button class name
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   * @param {String} backgroundClass - class given to the button inner div - 
   * default : amst__svg-background
   * amst__svg-background is used by all buttons except the more button
   */
  constructor(name, player, ui, backgroundClass) {
    //Call the button constructor
    super(name, player, ui, backgroundClass)
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */



  /* -------------------------------------------------------------------------- */
  /*                                   METHODS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * @method update()
   * @description : updates the button properties (label/disabled/hidden/tooltip) 
   * according to the button state
   */
  update() {
    //Pass the label according to the state
    super.update(this.state ? this.params.label.on : this.params.label.off)
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END METHODS                                */
  /* -------------------------------------------------------------------------- */



  /* -------------------------------------------------------------------------- */
  /*                             STATE GETTER/SETTER                            */
  /* -------------------------------------------------------------------------- */
  /**
   * @getter
   * @return {Boolean}
   * @description : Return the button state
   */
  get state() {
    return this.#state
  }

  /**
   * @setter
   * @param {Boolean} state
   * @description : Set the button state
   */
  set state(state) {
    if (state != this.#state) {
      const b = this.button
      if (state) {
        b.classList.add('amst__on')
      } else {
        b.classList.remove('amst__on')
      }
      this.#state = state
      this.update()
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                           END STATE GETTER/SETTER                          */
  /* -------------------------------------------------------------------------- */
}