//cSpell:words amstramgram oups
import { clone } from "../tools/utils.js"

const
  instanceOptions = {
    appLabel: 'Audio Player',
    alwaysShowHours: false,
    compactMaxWidth: 600,
    errorMessage: "Oups ! Media can't be found !!!",
    hideControlsDelay: 5000,//Only used for vertical volume slider on not mobile devices whose pointer is not mouse
    miniMaxWidth: 500,
    timeSliderHelpText: 'Use Left/Right arrow keys to go backward/forward',
    timeSliderLabel: 'Time Slider',
    volumeBeforeMute: 0.8,
    volumeGroup: 0,
    volumeSliderHelpText: 'Use Up/Down arrow keys to increase/decrease the volume',
    volumeHorizontal: true,
    volumeSliderLabel: 'Volume slider'
  },
  srcOptions = {
    autoplay: false,
    crossOrigin: undefined,
    download: { label: 'Download', disabled: false, hidden: false, tooltip: { hidden: false, left: true } },
    duration: 120,
    loop: false,
    more: { label: { on: 'Show less', off: 'Show more' }, tooltip: { hidden: false, left: true } },
    mute: { label: { on: 'Unmute', off: 'Mute' }, disabled: false, hidden: false, tooltip: { hidden: false, left: true } },
    next: { label: 'Next', disabled: true, hidden: true, tooltip: { hidden: false, left: false } },
    playbackRate: 1,
    playPause: { label: { on: 'Pause', off: 'Play' }, tooltip: { hidden: false, left: false } },
    preload: 'none',
    previous: { label: 'Previous', disabled: true, hidden: true, tooltip: { hidden: false, left: false } },
    settings: { hidden: false, qualityLabel: 'QUALITY', playbackRatesLabel: 'PLAYBACK SPEED', playbackRates: [['0.25 x', 0.25], ['0.5 x', 0.5], ['0.75 x', 0.75], ['Normal', 1], ['1.5 x', 1.5], ['2 x', 2], ['4 x', 4]], subsLabel: 'SUBTITLES' },
    skipTime: '1%',
    src: [],
    subtitles: { label: { on: 'Disable subtitles', off: 'Enable subtitles' }, disabled: false, hidden: false, tooltip: { hidden: false, left: true }, state: false, wrapper: '', container: '', sources: [], default: 'fr' },
    volume: 0.8,
    volumeForced: false,
  }

/**
 * @class AudioDefaultOptions
 * @description Defines the default options of the AmstramgramAudioPlayer
 */
export default class AudioDefaultOptions {
  /**
   * @getter instance
   * @returns {Object}
   * @description returns the default options for an AmstramgramAudioPlayer instance
   */
  static get instance() {
    return { ...instanceOptions }
  }

  /**
   * @getter src
   * @returns {Object}
   * @description returns the default parameters for an AmstramgramAudioPlayer src
   */
  static get src() {
    return clone(srcOptions)
  }
}
