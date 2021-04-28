/*
  PASSIVE EVENTS SUPPORT
  https://github.com/WICG/EventListenerOptions/blob/gh-pages/EventListenerOptions.polyfill.js
*/
let supportEventOptions = false
document.createElement("div").addEventListener("test", _ => { }, {
  get once() {
    supportEventOptions = true
    return false
  }
})

let _$ = (context) => {
  context = (typeof context === 'string' && document.querySelector(context)) ? document.querySelector(context) : context
  let $ = (selector = context) => {
    const el = (typeof selector === 'string' && context.querySelector(selector)) ? context.querySelector(selector) : selector
    if (!el.tagName) return
    el.css = (newCSS) => {
      if (typeof newCSS === 'string') {
        let v = window.getComputedStyle(el, null).getPropertyValue(newCSS)
        return isNaN(parseFloat(v)) ? v : (parseFloat(v))
      } else {
        Object.assign(el.style, newCSS)
        return el
      }
    }
    el.setAttributes = (attrs) => {
      Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]))
      return el
    }
    el.on = function (events, handler, options = false) {
      events.split(' ').forEach(e => {
        if (supportEventOptions)
          el.addEventListener(e, handler, options)
        else {
          if (options.once === true) {
            el.addEventListener(e, function listener() {
              //CAVEAT: can't be remove by off
              handler()
              el.removeEventListener(e, listener)
            }, (options.capture == true) ? true : false)
          } else {
            el.addEventListener(e, handler, (options.capture == true) ? true : false)
          }
        }
      })
      return el
    }
    el.off = function (events, handler) {
      events.split(' ').forEach(e => el.removeEventListener(e, handler))
      return el
    }
    return el
  }
  return $
}


let _$$ = (context) => {
  context = (typeof context === 'string' && document.querySelector(context)) ? document.querySelector(context) : context
  let $$ = (selector) => {
    const els = (Array.isArray(selector)) ? selector : Array.from(context.querySelectorAll(selector))
    els.css = (newCSS) => {
      if (typeof newCSS === 'string') {
        let v = window.getComputedStyle(els[0], null).getPropertyValue(newCSS)
        return isNaN(parseFloat(v)) ? v : (parseFloat(v))
      } else {
        els.forEach(el => Object.assign(el.style, newCSS))
        return els
      }
    }
    els.on = function (events, handler, options = false) {
      els.forEach(el => events.split(' ').forEach(e => {
        if (supportEventOptions)
          el.addEventListener(e, handler, options)
        else {
          if (options.once === true) {
            el.addEventListener(e, function listener() {
              //CAVEAT: can't be remove by off
              handler()
              el.removeEventListener(e, listener)
            }, (options.capture == true) ? true : false)
          } else {
            el.addEventListener(e, handler, (options.capture == true) ? true : false)
          }
        }
      }))
      return els
    }
    els.off = function (events, handler) {
      els.forEach(el => events.split(' ').forEach(e => el.removeEventListener(e, handler)))
      return els
    }
    return els
  }
  return $$
}

export { _$, _$$ }