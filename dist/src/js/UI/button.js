//cSpell:words amstramgram amst tabindex beforeend

/**
 * Class Button.
 * @HTML :
 *  <div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>
 */
export default class Button {
  /**
   * @private {Boolean} #hidden - Store the hidden property of the button
   */
  #hidden

  /**
   * PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * METHODS
   * @method update() : updates the button properties (label/disabled/hidden/tooltip)
   * called on amst__src-change and amst__${name}-should-update events
   */

  /**
   * EVENTS GENERATED
   * @event amst__name-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__name-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {String} name - button name
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   * @param {String} backgroundClass - class given to the button inner div - default : amst__svg-background
   * amst__svg-background is used by all buttons except the more button
   */
  constructor(name, player, ui, backgroundClass = "amst__svg-background") {
    backgroundClass = (backgroundClass === '') ? '' : ` class="${backgroundClass}"`
    //Insertion of the button in the ui
    ui.insertAdjacentHTML('beforeend', `<div role="button" class="amst__${name}" tabindex="0"><div${backgroundClass}></div></div>`)

    this.name = name
    this.player = player
    this.params = player.params[name]
    this.button = ui.querySelector(`.amst__${name}`)
    this.#hidden = this.params.hidden

    //Listening to the click event
    this.button.addEventListener('click', e => this.player.emit(`amst__${name}-click`, this, e))
    //Listening to the focus event
    this.button.addEventListener('focus', _ => this.player.emit('amst__focus'))

    player.on(`amst__src-change amst__${name}-should-update`, _ => this.update())
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   METHODS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * @method update()
   * @param {String} label - button label
   * toggleButtons pass a label depending of their state on/off
   * 
   * @description : updates the button properties (label/disabled/hidden/tooltip)
   * called on amst__src-change and amst__${name}-should-update events
   */
  update(label = this.params.label) {
    const
      b = this.button,
      p = this.params
    //Setting the label
    if (label) b.setAttribute('aria-label', label)
    //Disabled property
    //More, playPause and settings buttons doesn't have disabled property
    if (p.disabled && p.disabled === true) {
      b.setAttribute('data-disabled', true)
    } else {
      b.removeAttribute('data-disabled')
    }
    //Hidden property
    if (p.hidden === true) {
      b.classList.add('amst__hidden')
    } else {
      b.classList.remove('amst__hidden')
    }
    //If we should show tooltip and if there is a label
    if (p.tooltip && p.tooltip.hidden === false && label != '') {
      b.classList.add('amst__tooltip')
      if (p.tooltip.left === true) {
        b.classList.add('amst__tooltip-left')
      } else {
        b.classList.remove('amst__tooltip-left')
      }
    } else {
      b.classList.remove('amst__tooltip', 'amst__tooltip-left')
    }
    //UI should resize if the hidden parameter changes
    if (p.hidden != this.#hidden) {
      this.#hidden = p.hidden
      this.player.emit('amst__should-resize')
    }
    this.player.emit(`amst__${this.name}-update`, this)
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END METHODS                                */
  /* -------------------------------------------------------------------------- */
}