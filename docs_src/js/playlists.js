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
    methods = 'querySelector querySelectorAll forEach addEventListener dispatchEvent contains add remove on toggle play setAudioSource setVideoSource params log',
    properties = 'innerHTML removeAttribute classList options audioOptions videoOptions paused currentTime duration previous next src length CustomEvent media',
    vars = 'audioWrapper audioPlaylist ulContent audioCurrentId audioPlayer videoWrapper videoPlaylist videoPlayer videoCurrentId errorTimeOut mySrc',
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
  document.addEventListener('transitionend', _ => {
    window.dispatchEvent(new CustomEvent('resize'))
  })

  /**
   * Redefine the class options for audio and video players
   */
  AmstramgramMediaPlayer.options = {
    //Next and previous button are hidden by default so we show them.
    next: { hidden: false },
    previous: { hidden: false },
  }

  /**
   * For the audio player, we hide the download button 
   * and reset the playbackRates array of the settings panel
   * because we don't want to give the user the ability to change playback speed.
   * (by default : 
   *  playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]]
   * )
  */
  AmstramgramMediaPlayer.audioOptions = {
    download: { hidden: true },//Download button is visible by default
    settings: { playbackRates: [] },
  }

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
  const audioPlayer = new AmstramgramMediaPlayer(
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
      //If needed, reset the current active line
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
          disabled: (id == 0)
        },
        next: {
          label: (id == audioPlaylist.length - 1) ? 'Nothing' : audioPlaylist[id + 1].title,
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

  AmstramgramMediaPlayer.videoOptions = {
    errorMessage: "First video will play in 2 seconds",
    poster: 'assets/video/PosterPlaylist.jpg',
  }

  const
    videoWrapper = document.querySelector('.video-playlist-wrapper'),
    videoPlaylist = [
      {
        title: 'Les castors',
        src: {//An object containing all the video parameters 
          duration: 210,
          src: [
            {
              src: 'assets/video/Castors-360p.mp4',
              quality: '360p'
            },
            {
              src: 'assets/video/Castors-480p.mp4',
              quality: '480p'
            },
            {
              src: 'assets/video/Castors-720p.mp4',
              quality: '720p',
              default: true
            },
            {
              src: 'assets/video/Castors-1080p.mp4',
              quality: '1080p'
            },
          ],
          thumbnails: {
            src: 'assets/video/Castors-thumbnails.jpg',
            int: 2.12
          },
          subtitles: {
            sources: [
              {
                src: 'assets/video/Castors-fr.vtt',
                label: 'Français',
                srclang: 'fr',
              },
              {
                src: 'assets/video/Castors-en.vtt',
                label: 'English',
                srclang: 'en',
              },
            ],
            default: 'en'
          }
        }
      },
      {
        title: 'France',
        src: {
          duration: 327,
          src: [
            {
              src: 'assets/video/France-360p.mp4',
              quality: '360p'
            },
            {
              src: 'assets/video/France-480p.mp4',
              quality: '480p'
            },
            {
              src: 'assets/video/France-720p.mp4',
              quality: '720p',
            },
            {
              src: 'assets/video/France-1080p.mp4',
              quality: '1080p'
            },
          ],
          thumbnails: {
            src: 'assets/video/France-thumbnails.jpg',
            int: 3.28
          },
          download: { disabled: true },
        }
      },
      {
        title: 'Joyeuses Pâques',
        src: {
          duration: 40,
          format: 4 / 3,//Yep ! It's an old one !
          src: [
            {
              src: 'assets/video/Joyeuses_Paques-360p.mp4',
              quality: '360p'
            },
            {
              src: 'assets/video/Joyeuses_Paques-480p.mp4',
              quality: '480p'
            },
            {
              src: 'assets/video/Joyeuses_Paques-720p.mp4',
              quality: '720p',
            },
            {
              src: 'assets/video/Joyeuses_Paques-1080p.mp4',
              quality: '1080p'
            },
          ],
        }
      },
      {
        title: 'Le plouc',
        src: {
          duration: 186,
          src: [
            {
              src: 'assets/video/Le_plouc-360p.mp4',
              quality: '360p'
            },
            {
              src: 'assets/video/Le_plouc-480p.mp4',
              quality: '480p'
            },
            {
              src: 'assets/video/Le_plouc-720p.mp4',
              quality: '720p',
            },
            {
              src: 'assets/video/Le_plouc-1080p.mp4',
              quality: '1080p'
            },
          ],
          thumbnails: {
            src: 'assets/video/Le_plouc-thumbnails.jpg',
            int: 1.88
          },
        }
      },
      {
        title: 'Error',
        src: {
          duration: 186,
          src: 'assets/video/noFile.mp4',
        }
      },
    ]

  //Building the menu track list
  ulContent = ''
  videoPlaylist.forEach(el => {
    ulContent += `<li><span class="notranslate">${el.title}</span></li>`
  })
  videoWrapper.querySelector('ul').innerHTML = ulContent

  let 
    videoCurrentId,//Store the current track id
    errorTimeOut


  //Initializing the video player
  const videoPlayer = new AmstramgramMediaPlayer(
    videoWrapper.querySelector('video'),//target of the instance 
    {
      crossOrigin: "anonymous",
      volumeHorizontal: false,//Set a vertical volume slider
      volumeGroup: 1,//Volume will not be linked to other players volume
    },
    function () {//Function call after player initialization
      //this = player instance
      this
        //listening to the play and pause events dispatched by the player
        //to update the track list menu
        .on('amst__play', _ => {
          clearTimeout(errorTimeOut)
          videoWrapper.querySelectorAll('li')[videoCurrentId].classList.add('playing')
          console.log('Player plays !')
        })
        .on('amst__pause', _ => {
          videoWrapper.querySelectorAll('li')[videoCurrentId].classList.remove('playing')
          console.log('Player pauses !')
        })
        .on('amst__error', _ => {
          //Should be dispatched when clicking on the Error line
          console.log("Media file can't be found !!!")
          //Launch the first video after 2 seconds
          errorTimeOut = setTimeout(_ => {setVideoSource(0); this.play()}, 2000)
        })
        //Change the source when click on Next or Previous button
        .on('amst__previous-click', _ => setVideoSource(videoCurrentId - 1))
        .on('amst__next-click', _ => setVideoSource(videoCurrentId + 1))
        //Log buttons clicked events
        .on('amst__previous-click amst__playPause-click amst__next-click amst__mute-click amst__subtitles-click amst__fullscreen-click amst__pip-click amst__download-click', (button, event) => {
          //Log the button name
          console.log("The " + button.name + " button has been clicked !")
          //Log the button properties
          console.log('The button properties : ', button.params)
          //Log the original event
          console.log('The original event : ', event)
        })
        .on('amst__fullscreen-enter', _ => {
          console.log('The player enters in fullscreen mode !')
        })
        .on('amst__fullscreen-exit', _ => {
          console.log('The player exits fullscreen mode !')
        })
        .on('amst__reset', _ => {
          console.log('The player has been reset !')
        })
        .on('amst__resize', _ => {
          console.log('The player has been resized !')
        })
        .on('amst__src-change', _ => {
          console.log('The player source has been changed !')
        })
        //Log settings changed events
        .on('amst__settings-change', (setting, oldValue, newValue) => {
          setting = (setting == 'subs') ? 'Subtitles language' : setting.charAt(0).toUpperCase() + setting.slice(1)
          console.log('amst__settings-change event : ' + setting + ' has changed from ' + oldValue + ' to ' + newValue)
        })
        .on('amst__playbackRate-change', (oldValue, newValue) => {
          console.log('amst__playbackRate-change event : Playback rate has changed from ' + oldValue + ' to ' + newValue)
        })
        .on('amst__quality-change', (oldValue, newValue) => {
          console.log('amst__quality-change event : Quality has changed from ' + oldValue + ' to ' + newValue)
        })
        .on('amst__subs-change', (oldValue, newValue) => {
          console.log('amst__subs-change event : Subtitles language has changed from ' + oldValue + ' to ' + newValue)
        })
      //When a video ends, play the next one if there is one
      this.params.media.addEventListener('ended', _ => {
        if (videoCurrentId + 1 < videoPlaylist.length) {
          setVideoSource(videoCurrentId + 1)
          this.play()
        }
      })
      //Set the first element of our audioPlaylist array as player primary source   
      setVideoSource(0)
    }
  )

  //Listening to the click event on the track list menu <li> items
  Array.from(videoWrapper.querySelectorAll('li')).forEach((li, id) => {
    li.addEventListener('click', _ => {
      if (li.classList.contains('active')) {
        videoPlayer.toggle()
      } else {
        setVideoSource(id)
        if (videoPlayer.paused) videoPlayer.play()
      }
    })
  })

  function setVideoSource(id) {
    if (id >= 0 && id < videoPlaylist.length && id != videoCurrentId) {
      //On first call, no line is active
      //If needed, reset the current active line
      if (videoWrapper.querySelector('li.active')) videoWrapper.querySelector('li.active').removeAttribute('class')
      videoWrapper.querySelectorAll('li')[id].classList.add('active')
      //Store the playback state
      const paused = videoPlayer.paused
      let mySrc = videoPlaylist[id].src
      //Update the previous button properties
      mySrc.previous = {
        label: (id == 0) ? 'Nothing' : videoPlaylist[id - 1].title,
        disabled: (id == 0)
      }
      //Update the next button properties
      mySrc.next = {
        label: (id == videoPlaylist.length - 1) ? 'Nothing' : videoPlaylist[id + 1].title,
        disabled: (id == videoPlaylist.length - 1)
      }
      //Set the src with all relevant parameters
      videoPlayer.src = mySrc
      //Update the current video id
      videoCurrentId = id
      //Update the video title
      videoWrapper.querySelector('.track-title').innerHTML = videoWrapper.querySelector('li.active').innerHTML
      //If the player was playing, start the playback
      if (!paused) videoPlayer.play()
    }
  }
}, false)