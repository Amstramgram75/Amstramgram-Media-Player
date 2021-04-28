import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const
    keywords = 'AmstramgramAudioPlayer AmstramgramMediaPlayer myPlayer',
    methods = 'on off onPlayPauseClick log',
    properties = 'name params',
    vars = ''

  initHLJS(keywords, methods, properties, vars)

}, false)