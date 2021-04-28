import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const keywords = 'AmstramgramMediaPlayer AmstramgramAudioPlayer'
  initHLJS(keywords)

}, false)
