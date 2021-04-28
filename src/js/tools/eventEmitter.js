//https://gist.github.com/mudge/5830382#gistcomment-2691957
export default class EventEmitter {
  constructor() {
    this.events = {}
  }
  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set()
    }
    return this.events[eventName]
  }
  on(eventsNames, fn) {
    const self = this
    eventsNames.split(' ').forEach(eventName => {
      //Skip if fn is already registered
      if (!self._getEventListByName(eventName).has(fn)) {
        self._getEventListByName(eventName).add(fn)
      }
    })
    return this
  }
  emit(eventName, ...args) {
    this._getEventListByName(eventName).forEach(function (fn) {
      fn.apply(this, args)
    }.bind(this))
    return this
  }
  off(eventName, fn) {
    this._getEventListByName(eventName).delete(fn)
  }
}