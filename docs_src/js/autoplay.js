import main from './common/main';
import aside from './common/aside';
import code from './common/code';

/**
 * IMPORTANT : comment line 559 in highlight.js/languages/javascript.js
 * { begin: '\\.' + IDENT_RE$1 }
 */

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const
    keywords = 'AmstramgramMediaPlayer',
    methods = 'querySelector addEventListener dispatchEvent on off hideControls hideControlsWhenPlayBegin',
    properties = 'CustomEvent'

  initHLJS(keywords, methods, properties)

  /**
   * Players are listening to the window resize and scroll events to update
   * their UI accordingly to their dimensions and position and prevent
   * some erratic behavior of the time and volume sliders.
   * The sidebar animation on this page may affect the players dimensions
   * without the browser triggering the common resize event.
   * So :
  */
  document.querySelector('aside').addEventListener('transitionend', _ => {
    window.dispatchEvent(new CustomEvent('resize'))
  })

 new AmstramgramMediaPlayer(document.querySelector('video'), {
    volumeGroup: 2,
    volumeForced: true,
  }, function () {
    //this = our player
    //Start listening to amst__play event
    this.on('amst__play', function hideControlsWhenPlayBegin() {
      //this = our player
      //Stop listening
      this.off('amst__play', hideControlsWhenPlayBegin)
      //Hide the controls
      this.hideControls()
    })
  })
}, false)