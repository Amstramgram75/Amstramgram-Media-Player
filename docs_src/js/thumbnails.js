import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const
    keywords = 'AmstramgramMediaPlayer',
    methods = 'querySelector addEventListener dispatchEvent on off onFirstPlay hideControls params',
    properties = 'CustomEvent media'

  initHLJS(keywords, methods, properties)

  /**
   * Players are listening to the window resize and scroll events to update
   * their UI accordingly to their dimensions and position
   * and prevent some erratic mouse behavior on the time and volume sliders.
   * The sidebar animation on this page may affect the players dimensions
   * without the browser triggering the common resize event.
   * So :
  */
  document.querySelector('aside').addEventListener('transitionend', () => {
    window.dispatchEvent(new CustomEvent('resize'))
  })

  new AmstramgramMediaPlayer(
    document.querySelector('video'),//Our target tag
    {
      autoplay: true,//Set autoplay
      mute: { hidden: true },//Hide the volume button
      src: 'assets/thumbnails/timeCode.mp4',//Our video source
      thumbnails: {//Our thumbnails properties
        src: 'assets/thumbnails/timeCode-thumbs.jpg',//The source
        int: 1.24//The time interval between two thumbnails in seconds
      },
      volume: 0,//Set the volume to 0
      volumeForced: true//Force the player to ignore the volumeGroup value stored in session storage
    },
    function () {//Callback
      //listen to the 'amst__play' event dispatched by the player when playback begins.
      this.on('amst__play', function onFirstPlay() {
        this.off('amst__play', onFirstPlay)//Remove the listener
        this.hideControls()//Hide the player controls
        //Listen to the media 'ended' event
        this.params.media.addEventListener('ended', _ => {
          this.play()//Re-launch the playback
          this.hideControls()//And hide the controls
        })
      })
    }
  )
}, false)