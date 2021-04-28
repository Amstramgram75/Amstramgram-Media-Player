//cSpell:words amstramgram amst tabindex beforeend playbackrate

import Button from './button.js'


/**
 * Class SettingsButton.
 * @extends Button
 */
export default class SettingsButton extends Button {
  /**
   * INHERITED PROPERTIES
   * @property name - button name
   * @property player - player instance
   * @property params - button parameters
   * @property button - HTML button
   */

  /**
   * PROPERTIES
   * @property nodal - nodal wrapper
   * @property settingsContainer
   */

  /**
   * @private {Boolean} #state
   * @description : Stores the settings display visibility
   */
  #state = false

  /**
   * GETTER
   * @property {Boolean} state - true if settings are visible, false if not
   */

  /**
   * OVERRIDDEN METHODS
   * @method update() : updates the hidden button property and the available settings
   */

  /**
   * INHERITED EVENTS GENERATED
   * @event amst__settings-click : dispatch on click - transmit the instance and the event
   * @event amst__focus : dispatch when button is focused
   * @event amst__should-resize : send when the button is shown/hidden
   * @event amst__settings-update : send when the button has been updated
   */

  /**
   * CONSTRUCTOR
   * @param {AmstramgramAudioPlayer|AmstramgramVideoPlayer} player - player instance
   * @param {HTMLElement} ui - ui container to which the button will be added
   * @description : The settings are listed in a <ul> (settingsContainer) wrapped in a <div> (settingsWrapper).
   * 
   * On screens whose width and height are greater than 720px :
   *    - The wrapper is located above the button. 
   *        If the available space above the button is too small to contain the wrapper, 
   *        the wrapper is positioned under the button by the amst__align-bottom class.
   *        Available space above the button is calculated on window's resize event.
   *    - If mouse is used, the wrapper is shown when hovering the settings button and hidden when leaving.
   *    - If pointer is not mouse : 
   *          A tap on the settings button shows/hides the wrapper.
   *          If the wrapper is visible, a tap anywhere outside the container hides the wrapper.
   * 
   * On screens whose width or height are less than 720px : 
   *    The settings are displayed in the nodal window.
   *    The nodal window closes when a click occurs outside the settings container.
   * 
   */
  constructor(player, ui) {
    super('settings', player, ui)
    /*Insert the settings-display container which contains 
      a div for the close button (only visible on touch screens)
      and a <ul> for :
      SPEED
      QUALITY
      SUBTITLES
    */
    this.button.insertAdjacentHTML('beforeend', `<div class="amst__settings-display"><div></div><ul></ul></div>`)
    const
      button = this.button,
      settingsWrapper = button.querySelector('.amst__settings-display'),
      $ = player.params.$,
      //Nodal window contents the settings container when screen width or height is less than 720px
      nodal = this.nodal = player.params.nodal,
      self = this

    this.settingsContainer = settingsWrapper.querySelector('ul')

    /*
      If the mouse is used, hovering the button shows the settings panel (via CSS).
      If not, a pointerdown event on button shows/hides the settings panel
    */
    //For pointers other than mouse :
    button.querySelector('.amst__svg-background').addEventListener(player.params.pointerup, _ => {
      if (player.params.currentPointerType == 'mouse') return
      this.state ? hide() : show()
    })

    /**
     * @function hide()
     * @description hides the settings panel
     */
    function hide() {
      //Hides and reset the nodal window
      nodal.hide()
      //Remove event listeners
      nodal.container.removeEventListener('click', onNodalClick)
      window.removeEventListener('click', onWindowClick)
      //Reset the button
      button.classList.remove('amst__on')//Hides the settings-display wrapper
      self.#state = false
    }

    /**
     * @function show()
     * @description shows the settings panel
     * Only called by pointerdown event on button if currentPointerType is not mouse
     */
    function show() {
      if (window.innerWidth <= 720 || window.innerHeight <= 720) {
        //Show nodal
        nodal.show('<ul>' + self.settingsContainer.innerHTML + '</ul>')
        //Listens to click event on nodal to hide it
        //setTimeout otherwise nodal container will receive the click event and trigger the hide method
        setTimeout(_ => nodal.container.addEventListener('click', onNodalClick), 50)
      } else {
        //Listens to click event on window to hide settings panel
        setTimeout(_ => window.addEventListener('click', onWindowClick), 50)
      }
      button.classList.add('amst__on')//Shows the settings-display wrapper
      self.#state = true
    }

    /**
     * @function onWindowClick()
     * @description Listens to click event on window as long as the settingsWrapper is shown
     * If the click occurs outside the settingsContainer, the settingsWrapper is hidden 
     */
    function onWindowClick(e) {
      //Ignore the event if the target belongs to the settingsContainer
      let el = e.target
      while (el = el.parentNode) {
        if (el == self.settingsContainer) return
      }
      //If the click occurs outside the settingsContainer, hides the settingsWrapper
      hide()
    }

    /**
     * @function onNodalClick()
     * @description Listens to click event on nodal.
     * If the click occurs outside the settings container, the nodal is hidden 
     */
    function onNodalClick(e) {
      //e.currentTarget is nodal by definition.
      //if e.target == e.currentTarget, the click has occurred outside the settings container
      if (e.target == e.currentTarget) hide()
      //If the click occurs on a line not marked as selected, call the change function
      if (e.target.hasAttribute('data-setting') && !e.target.classList.contains('amst__selected')) change(e)
    }

    this.settingsContainer.addEventListener('click', e => {
      //If the click occurs on a line not marked as selected, call the change function
      if (e.target.hasAttribute('data-setting') && !e.target.classList.contains('amst__selected')) change(e)
    })

    /**
     * @function change()
     * @param {event} e - needed to get the target properties
     * @description applies the change
     */
    function change(e) {
      const
        setting = e.target.getAttribute('data-setting'),
        value = e.target.getAttribute('data-value'),
        media = player.params.media,
        oldLine = $(`li[data-setting="${setting}"].amst__selected`),
        oldValue = (setting == 'quality') ? oldLine.innerHTML : oldLine.getAttribute('data-value'),
        newLine = $(`li[data-value="${value}"]`),
        newValue = (setting == 'quality') ? newLine.innerHTML : value
      //reset selected
      $(`li[data-setting="${setting}"].amst__selected`).classList.remove('amst__selected')
      //Set new selected
      $(`li[data-value="${value}"]`).classList.add('amst__selected')
      //Update nodal content if it's visible
      if (nodal.visible) nodal.show('<ul>' + self.settingsContainer.innerHTML + '</ul>')
      //Change playbackRate
      if (setting == 'playbackRate') {
        media.playbackRate = parseFloat(value)
        player.emit('amst__playbackRate-change', oldValue, newValue)
        player.emit('amst__settings-change', 'playbackRate', oldValue, newValue)
      }
      //Change quality
      if (setting == 'quality') {
        const
          quality = e.target.textContent,
          s = window.sessionStorage,
          type = player.params.type,
          currentTime = media.currentTime,
          playbackRate = media.playbackRate,
          isPlaying = !player.paused,
          readyState = media.readyState > 0//Metadata loaded
        //Update default quality in sessionStorage
        if (quality != s.getItem(`amst__${type}DefaultQuality`)) s.setItem(`amst__${type}DefaultQuality`, quality)
        if (isPlaying) media.pause()
        //Updates media source
        media.src = value

        if (readyState) media.load()
        //Restores currentTime and playbackRate
        media.on('loadeddata', function restoreCurrentTime() {
          media.off('loadeddata', restoreCurrentTime)
          media.currentTime = currentTime
        })
        media.playbackRate = playbackRate
        player.emit('amst__quality-change', oldValue, newValue)
        player.emit('amst__settings-change', setting, oldValue, newValue)
        if (isPlaying) media.play()
      }
      //Change subs
      if (setting == 'subs') {
        for (let i = 0; i < media.textTracks.length; i++) {
          media.textTracks[i].mode = (media.textTracks[i].language == value) ? 'hidden' : 'disabled'
          //Displays the subtitles
          player.subtitles = { state: true }
        }
        player.emit('amst__subs-change', oldValue, newValue)
        player.emit('amst__settings-change', setting, oldValue, newValue)
      }
      //Force the button to loose the focus.
      //Otherwise, the settings will not be hidden when mouse leaves
      self.button.blur()
    }

    player
      .on('amst__src-change', hide)//Hides the settings when source changes
      .on('amst__resize', resize)

    /**
     * @function resize()
     * @description if there is not enough space available above the button,
     * the wrapper is positioned under.
     */
    function resize() {
      const
        rectTop = button.getBoundingClientRect().top,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (rectTop + scrollTop < 350) {
        settingsWrapper.classList.add('amst__align-bottom')
      } else {
        settingsWrapper.classList.remove('amst__align-bottom')
      }
    }
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */



  /* -------------------------------------------------------------------------- */
  /*                                   GETTER                                   */
  /* -------------------------------------------------------------------------- */
  /**
   * @get state()
   * @return {Boolean} true if the settings panel is visible, false if not
   */
  get state() {
    return this.#state
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END GETTER                                 */
  /* -------------------------------------------------------------------------- */




  /* -------------------------------------------------------------------------- */
  /*                                   METHOD                                   */
  /* -------------------------------------------------------------------------- */
  /**
   * @method update()
   * @description : updates the hidden button property and the list of available settings
   */
  update() {
    super.update()
    const
      params = this.params,
      media = this.player.params.media

    //Reset the settingsContainer content
    this.settingsContainer.innerHTML = ''
    if (!params.hidden) {
      let
        listHTML = '',
        //Keep only the sources that have a quality property
        sources = this.player.params.src.filter(el => el.quality)

      /**
       * SPEED
       */
      if (params.playbackRates.length > 0) {
        /*
          Each element of the playbackRates array is either an array or a number.
          First element of the children arrays is a string used as label for the value given by the second element.
          If only a number is provided, label and value are equals. 
          playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]]
          listHTML = 
            <li>
              <span>PLAYBACK SPEED</span>
              <ul>
                <li data-setting="playbackRate" data-value="0.25">0.25 x</li>
                <li data-setting="playbackRate" data-value="0.5">0.5 x</li>
                <li data-setting="playbackRate" data-value="0.75">0.75 x</li>
                <li data-setting="playbackRate" data-value="1" class="amst__selected">Normal</li>
                <li data-setting="playbackRate" data-value="1.5">1.5 x</li>
                <li data-setting="playbackRate" data-value="2">2 x</li>
                <li data-setting="playbackRate" data-value="4">4 x</li>
              </ul>
            </li>
        */
        listHTML = `
          <li>
            <span>${params.playbackRatesLabel}</span>
            <ul>
          `
        params.playbackRates.forEach(el => {
          el = Array.isArray(el) ? el : [el, parseFloat(el)]
          const selected = (el[1] == this.player.params.playbackRate) ? ' class="amst__selected"' : ''
          listHTML += `<li data-setting="playbackRate" data-value="${el[1]}"${selected}>${el[0]}</li>`
        })
        listHTML += '</ul></li>'
      }
      /**
       * QUALITY
       */
      if (sources.length > 1) {
        /*
          listHTML = 
            <li>
              <span>QUALITY</span>
              <ul>
                <li data-setting="quality" data-value="path_to_360p.mp4">360p</li>
                <li data-setting="quality" data-value="path_to_480p.mp4">480p</li>
                <li data-setting="quality" data-value="path_to_720p.mp4" class="amst__selected">720p</li>
                <li data-setting="quality" data-value="path_to_1080p.mp4">1080p</li>
              </ul>
            </li>
        */
        listHTML += `
          <li>
            <span>${params.qualityLabel}</span>
            <ul>
          `
        sources.forEach(el => {
          const
            id = media.src.lastIndexOf(el.src),
            selected = (id >= 0) && (media.src.substring(0, id) + el.src == media.src) ? ' class="amst__selected"' : ''
          listHTML += `<li data-setting="quality" data-value="${el.src}"${selected}>${el.quality}</li>`
        })
        listHTML += '</ul></li>'
      }
      /**
       * SUBTITLES
       */
      if (media.textTracks.length > 1) {
        /*
          listHTML = 
            <li>
              <span>SUBTITLES</span>
              <ul>
                <li data-setting="subs" data-value="en">English</li>
                <li data-setting="subs" data-value="fr">Français</li>
              </ul>
            </li>
        */
        listHTML += `
          <li>
            <span>${params.subsLabel}</span>
            <ul>
          `
        for (let i = 0; i < media.textTracks.length; i++) {
          const
            t = media.textTracks[i],
            selected = t.mode == 'hidden' ? ' class="amst__selected"' : ''
          listHTML += `<li data-setting="subs" data-value="${t.language}"${selected}>${t.label}</li>`
        }
        listHTML += '</ul></li>'
      }
      this.settingsContainer.innerHTML = listHTML
      if (this.settingsContainer.childNodes.length == 0) {
        this.button.classList.add('amst__hidden')
      }
    }
    this.player.emit('amst__should-resize')
  }
}