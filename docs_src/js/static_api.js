import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  const
    keywords = 'AmstramgramAudioPlayer AmstramgramMediaPlayer',
    methods = 'pause forEach log',
    properties = 'options audioOptions videoOptions currentPlayer paused players download'

  initHLJS(keywords, methods, properties)

  Array.from(document.querySelectorAll('h2.not-audio, h2.get, h2.set')).forEach(el => {
    let toAppend = ''
    if (el.classList.contains('not-audio')) toAppend += `<span class="not-audio-mark" title="Not applicable to AmstramgramAudioPlayer class"></span>`
    if (el.classList.contains('get')) toAppend += `<span class="get-mark" title="Has a getter"></span>`
    if (el.classList.contains('set')) toAppend += `<span class="set-mark" title="Has a setter"></span>`
    el.insertAdjacentHTML('beforeend', toAppend)
  })

}, false)