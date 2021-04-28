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
    keywords = 'AmstramgramAudioPlayer',
    methods = 'querySelector querySelectorAll forEach addEventListener dispatchEvent contains add remove on toggle play setAudioSource setVideoSource params',
    properties = 'innerHTML removeAttribute classList options audioOptions videoOptions paused currentTime duration previous next src length CustomEvent media',
    vars = 'audioWrapper audioPlaylist ulContent audioCurrentId audioPlayer videoWrapper videoPlaylist videoPlayer videoCurrentId mySrc',
    params = 'id'

  initHLJS(keywords, methods, properties, vars, params)

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

  new AmstramgramAudioPlayer(
    document.querySelectorAll('audio')[0],
    {
      duration: 20//Display the duration since no metadata are downloaded.
    }
  )

  /**
   * For the next audio players, we hide the download button 
   * and reset the playbackRates array of the settings panel
   * because we don't want to give the user the ability to change playback speed.
   * (by default : 
   *  playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]]
   * )
  */
  AmstramgramAudioPlayer.options = {
    download: { hidden: true },//Download button is visible by default
    settings: { playbackRates: [] },
  }

  /*
  We declare a new AmstramgramAudioPlayer instance on the second <audio> tag
  the crossOrigin media property to "anonymous" because subtitles may be loaded from an external url
  provide a duration
  and set the subtitles parameters.
  The function passed as last parameter of the constructor
  is called after the instance initialization.

  IMPORTANT : preload has been set to none in HTML to prevent the browser
  to downloading the metadata of the first source it finds.
  Setting preload to auto in the instance options is more efficient 
  because the browser will load the metadata of the source marked as default.
  */
  new AmstramgramAudioPlayer(
    document.querySelectorAll('audio')[1],
    {
      crossOrigin: "anonymous",
      duration: 262,
      preload: 'auto',
      subtitles:
      {
        label://Adapt the button labels
        {
          on: 'Hide lyrics',//Default is "Hide Subtitles"
          off: 'Show lyrics'//Default is "Show Subtitles" 
        },
        state: true,//Subtitles are displayed by default
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

  const
    audioWrapper = document.querySelector('.audio-playlist-wrapper'),
    audioPlaylist = [
      {
        artist: 'Camille',
        title: 'Seeds',
        duration: 171,
        src: [
          {
            src: 'assets/audio/Camille-Seeds-128.mp3',
            quality: 'MP3 128K',
            type: 'audio/mpeg',
          },
          {
            src: 'assets/audio/Camille-Seeds-320.mp3',
            quality: 'MP3 320K',
            type: 'audio/mpeg',
          },
          {
            src: 'assets/audio/Camille-Seeds.wav',
            quality: 'WAV',
            type: 'audio/wav',
          },
        ]
      },
      {
        artist: 'Claude Nougaro',
        title: "Déjeuner sur l'herbe",
        duration: 257,
        src: [
          {
            src: "assets/audio/Claude_Nougaro-Dejeuner_sur_l'herbe-128.mp3",
            quality: 'MP3 128K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Claude_Nougaro-Dejeuner_sur_l'herbe-320.mp3",
            quality: 'MP3 320K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Claude_Nougaro-Dejeuner_sur_l'herbe.wav",
            quality: 'WAV',
            type: 'audio/wav',
          },
        ]
      },
      {
        artist: 'Jacques Higelin',
        title: "Ici, c'est l'enfer",
        duration: 254,
        src: [
          {
            src: "assets/audio/Jacques_Higelin-Ici_c'est_l'enfer-128.mp3",
            quality: 'MP3 128K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Jacques_Higelin-Ici_c'est_l'enfer-320.mp3",
            quality: 'MP3 320K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Jacques_Higelin-Ici_c'est_l'enfer.wav",
            quality: 'WAV',
            type: 'audio/wav',
          },
        ]
      },
      {
        artist: 'Olivier Marguerit',
        title: "Plonge dans l'eau",
        duration: 222,
        src: [
          {
            src: "assets/audio/Olivier_Marguerit-Plonge_dans_l'eau-128.mp3",
            quality: 'MP3 128K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Olivier_Marguerit-Plonge_dans_l'eau-320.mp3",
            quality: 'MP3 320K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Olivier_Marguerit-Plonge_dans_l'eau.wav",
            quality: 'WAV',
            type: 'audio/wav',
          },
        ]
      },
      {
        artist: 'Jacques Brel',
        title: "La ville s'endormait",
        duration: 254,
        src: [
          {
            src: "assets/audio/Jacques_Brel-La_ville_s'endormait-128.mp3",
            quality: 'MP3 128K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Jacques_Brel-La_ville_s'endormait-320.mp3",
            quality: 'MP3 320K',
            type: 'audio/mpeg',
          },
          {
            src: "assets/audio/Jacques_Brel-La_ville_s'endormait.wav",
            quality: 'WAV',
            type: 'audio/wav',
          },
        ]
      },
    ]

  //Building the menu track list
  let ulContent = ''
  audioPlaylist.forEach(el => {
    ulContent += `<li><span class="notranslate"><b>${el.artist}</b> - ${el.title}</span></li>`
  })
  audioWrapper.querySelector('ul').innerHTML = ulContent

  let audioCurrentId//Store the current track id

  //Initializing the audio player
  const audioPlayer = new AmstramgramAudioPlayer(
    audioWrapper.querySelector('audio'),//target of the instance 
    {},//No parameter
    function () {//Function call after player initialization
      //this = player instance
      this
        //listening to the play and pause events dispatched by the player
        //to update the track list menu
        .on('amst__play', _ => audioWrapper.querySelectorAll('li')[audioCurrentId].classList.add('playing'))
        .on('amst__pause', _ => audioWrapper.querySelectorAll('li')[audioCurrentId].classList.remove('playing'))
        //Change the source when click on Next or Previous button
        .on('amst__next-click', _ => setAudioSource(audioCurrentId + 1))
        .on('amst__previous-click', _ => setAudioSource(audioCurrentId - 1))
      //When a track ends, play the next one if there is one
      this.params.media.addEventListener('ended', _ => {
        if (audioCurrentId + 1 < audioPlaylist.length) {
          setAudioSource(audioCurrentId + 1)
          this.play()
        }
      })
      //Set the first element of our audioPlaylist array as player primary source   
      setAudioSource(0)
    }
  )

  //Listening to the click event on the track list menu <li> items
  Array.from(audioWrapper.querySelectorAll('li')).forEach((li, id) => {
    li.addEventListener('click', _ => {
      if (li.classList.contains('active')) {
        //If the click occurs on active line, toggle the playback
        audioPlayer.toggle()
      } else {
        //else, set the src according to the line id
        setAudioSource(id)
        //and force the playback to start
        if (audioPlayer.paused) audioPlayer.play()
      }
    })
  })

  function setAudioSource(id) {
    if (id >= 0 && id < audioPlaylist.length && id != audioCurrentId) {
      //On first call, no line is active
      if (audioWrapper.querySelector('li.active')) audioWrapper.querySelector('li.active').removeAttribute('class')
      audioWrapper.querySelectorAll('li')[id].classList.add('active')
      //Store the playback state
      const paused = audioPlayer.paused
      //Set the src with all relevant parameters
      audioPlayer.src = {
        src: audioPlaylist[id].src,
        duration: audioPlaylist[id].duration,
        previous: {
          label: (id == 0) ? 'Nothing' : audioPlaylist[id - 1].title,
          hidden: false,
          disabled: (id == 0)
        },
        next: {
          label: (id == audioPlaylist.length - 1) ? 'Nothing' : audioPlaylist[id + 1].title,
          hidden: false,
          disabled: (id == audioPlaylist.length - 1)
        },
      }
      //Update the current track id
      audioCurrentId = id
      //Update the track info
      audioWrapper.querySelector('.track-title').innerHTML = audioWrapper.querySelector('li.active').innerHTML
      //If the player was playing, star the playback
      if (!paused) audioPlayer.play()
    }
  }

}, false)