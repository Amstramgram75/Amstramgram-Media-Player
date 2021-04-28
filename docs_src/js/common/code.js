import hljsNonIE from 'highlight.js/lib/core';//V10 doesn't support IE11 anymore
import javascript from './javascript';
import html from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';

/**
 * IMPORTANT : comment line around 558 in highlight.js/languages/javascript.js
 * { begin: '\\.' + IDENT_RE$1 }
 */


//Called on  window load event
export default function code() {
  let hljs, k
  if (document.body.classList.contains('ie')) {
    //V9 is loaded in the page if IE is detected
    hljs = hljsIE
    k = 'k'
  } else {
    hljs = hljsNonIE
    k = 'keywords'
    hljs.registerLanguage('html', html)
    hljs.registerLanguage('javascript', javascript)
    hljs.registerLanguage('scss', scss)
  }
  hljs.configure({ tabReplace: '   ' }) // 2 spaces

  window.initHLJS = function (keywords = '', methods = '', properties = '', vars = '', params = '') {
    hljs.getLanguage('javascript')[k].amst = keywords
    hljs.getLanguage('javascript')[k].amst_methods = methods
    hljs.getLanguage('javascript')[k].amst_properties = properties
    hljs.getLanguage('javascript')[k].amst_vars = vars
    hljs.getLanguage('javascript')[k].amst_params = params
    Array.from(document.querySelectorAll('pre:not(.shell) code')).forEach(b => {
      if (document.body.classList.contains('ie')) {
        hljs.highlightBlock(b)
      } else {
        hljs.highlightElement(b)
      }
    })
  }

  /*
    The code is revealed by transitioning its max-height property,
    initially set to 0.
    When revealed, the pre container max-height is transitioned 
    to its scrollHeight updated on windows resize event
    and stored in its data-height attribute.
  */
  if (document.querySelectorAll('.show-code').length > 0) {
    Array.from(document.querySelectorAll('.show-code')).forEach(b => {
      b.addEventListener('change', function () {
        if (this.checked) {//Show code
          this.nextElementSibling.style.maxHeight = 'calc(100vh - 160px)'
        } else {//Hide code
          this.nextElementSibling.removeAttribute('style')
        }
      })
    })
  }

  Array.from(document.querySelectorAll('pre h4')).forEach(h => {
    h.insertAdjacentHTML('beforeend', '<div class="copy-code" role="button">Copy</div>')
  })

  //Copy button
  Array.from(document.querySelectorAll('div.copy-code')).forEach(b => {
    b.addEventListener('click', _ => {
      const range = document.createRange()
      range.selectNode(b.parentElement.nextElementSibling)
      window.getSelection().removeAllRanges() // clear current selection
      window.getSelection().addRange(range) // to select text
      document.execCommand("copy")
      window.getSelection().removeAllRanges()// to deselect
      b.classList.add('copy-succeed')
      setTimeout(_ => b.classList.remove('copy-succeed'), 2000)
    })
  })
}