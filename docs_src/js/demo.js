import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const
    keywords = 'AmstramgramMediaPlayer AmstramgramAudioPlayer',
    methods = 'querySelector querySelectorAll classList addEventListener dispatchEvent',
    properties = 'currentTime remove CustomEvent',
    params = 'element options callback'

  initHLJS(keywords, methods, properties, '', params)

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
    document.querySelectorAll('audio')[0],
    {
      duration: 20//Display the duration since no metadata are downloaded.
    }
  )

  /*
  First, we set some class global options (all the players created below will get those options as default) :
  - we set the crossOrigin media property to "anonymous" because subtitles may be loaded from an external url
  - we hide the download button cause it's visible by default.
  - we reset the playbackRates array of the settings panel
        because we don't want to give the user the ability to change playback speed.
        (by default : 
        playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]])
        If you really care, you can test this option in the basic example above.
  - we set the subtitles button labels to Hide lyrics / Show lyrics and force its state to true 
        so the lyrics are displayed by default.
  */
  AmstramgramMediaPlayer.options = { 
    crossOrigin: "anonymous",
    download: { hidden: true }, 
    settings: { playbackRates: [] }, 
    subtitles: { 
      label: { 
          on: 'Hide lyrics', 
          off: 'Show lyrics' 
      }, 
      state: true 
    } 
  }

  /*
  - We declare a new AmstramgramMediaPlayer instance on the <audio> tag,
      provide a duration
      and set the wrapper and container properties of the subtitles option.
  - The function passed as last parameter of the constructor
      is called after the instance initialization.

  IMPORTANT : preload has been set to none in HTML to prevent the browser
  to downloading the metadata of the first source it finds.
  Setting preload to auto in the instance options is more efficient 
  because the browser will load the metadata of the source marked as default.
  */
  new AmstramgramMediaPlayer(
    document.querySelectorAll('audio')[1], 
    {
      duration: 262,
      preload:'auto',
      subtitles: { 
          wrapper: '.audio-subtitles-wrapper', 
          container: '.audio-subtitles-container' 
      },
    }, 
    function () {//Function called after instance initialization
      /*
      If the subtitles wrapper is styled with padding and background-color (which is the case here),
      it will be displayed as an empty rectangle when there is no subtitles.
      To avoid this, the instance adds to it the amst__subtitles-empty class
      each time there is no subtitle to display.
      This class just sets the display property to 'none'.
      But here, we'd like to show the track info written in the container.
      So, we just remove the amst__subtitles-empty class.
      */
      document.querySelector('.amst__subtitles-empty').classList.remove('amst__subtitles-empty')
    }
  )

  /*
  We declare a new AmstramgramMediaPlayer instance on the <video> tag,
  set its duration to 261 (i.e. 4 minutes and 21 seconds.
  Thus, the correct duration is displayed even though the metadata have not been loaded).
  define the thumbnails src and choose a vertical volume slider.
  */
  new AmstramgramMediaPlayer(document.querySelector('video'), {
    duration: 261,
    thumbnails: { 
      src: 'assets/video/Le_Prince_Miiaou_POISSON_thumbnails.jpg',
      int: 2.6
    },
    volumeHorizontal: false
  })
}, false)
