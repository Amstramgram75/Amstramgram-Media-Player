import main from './common/main';
import aside from './common/aside';
import code from './common/code';

window.addEventListener("load", function () {
  main()
  aside()
  code()

  initHLJS()

  Array.from(document.querySelectorAll('h2.src, h2.inst, h2.html, h2.get, h2.set')).forEach(el => {
    let toAppend = ''
    if (el.classList.contains('html')) toAppend += `<span class="html-mark" title="Can be directly set in HTML"></span>`
    if (el.classList.contains('inst')) toAppend += `<span class="inst-mark" title="Instance option"></span>`
    if (el.classList.contains('src')) toAppend += `<span class="src-mark" title="Instance or source option"></span>`
    if (el.classList.contains('get')) toAppend += `<span class="get-mark" title="Has a getter"></span>`
    if (el.classList.contains('set')) toAppend += `<span class="set-mark" title="Has a setter"></span>`
    el.insertAdjacentHTML('beforeend', toAppend)
  })

}, false)