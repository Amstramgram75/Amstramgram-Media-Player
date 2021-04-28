import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const
    keywords = 'AmstramgramAudioPlayer AmstramgramMediaPlayer myPlayer',
    methods = 'log play pause hideControls showControls toggle on off',
    properties = 'currentTime download fullscreen more mute muted next paused pip previous settings src subtitles',
    vars = 'count'

  initHLJS(keywords, methods, properties, vars)


  Array.from(document.querySelectorAll('h2.get, h2.set')).forEach(el => {
    let toAppend = ''
    if (el.classList.contains('get')) toAppend += `<span class="get-mark" title="Has a getter"></span>`
    if (el.classList.contains('set')) toAppend += `<span class="set-mark" title="Has a setter"></span>`
    el.insertAdjacentHTML('beforeend', toAppend)
  })

}, false)