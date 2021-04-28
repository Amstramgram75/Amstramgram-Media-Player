//cSpell:words amstramgram amst

import EventEmitter from "./eventEmitter.js"

/**
 * @class PointerDetector extends EventEmitter
 * @description Singleton in charge of pointer events names standardization
 */
class PointerDetector extends EventEmitter {
  /* -------------------------------------------------------------------------- */
  /*                               PRIVATE FIELDS                               */
  /* -------------------------------------------------------------------------- */
  //Stores the current pointer type ("touch" or "mouse")
  #currentPointerType

  /*
    Stores the corresponding names for /
    - pointerEventsInterface ("pointer", "touch" or "mouse")
    - pointerenter ("pointerenter", "none", "mouseenter")
    - pointerleave ("pointerleave", "none", "mouseleave")
    - pointerup ("pointerup", "touchend", "mouseup")
    - pointerdown ("pointerdown", "touchstart", "mousedown")
    - pointermove ("pointermove", "touchmove", "mousemove")
  */
  #data = {}


  /* -------------------------------------------------------------------------- */
  /*                              EVENT EMITTED                                 */
  /* -------------------------------------------------------------------------- */
  //amst__pointerChange: emitted when pointer type changes


  /* -------------------------------------------------------------------------- */
  /*                                  GETTERS                                   */
  /* -------------------------------------------------------------------------- */
  /**
   * @getter currentPointerType
   * @returns {string} "mouse" or "touch"
   */

  /**
   * @getter data
   * @returns {object}
   * {
   *  pointerEventsInterface: 'touch',
   *  pointerenter: 'none',
   *  pointerleave: 'none',
   *  pointerup: 'touchup',
   *  pointerdown: 'touchdown',
   *  pointermove: 'touchmove'
   * }
   */


  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor() {
    //If first instantiation
    if (!PointerDetector.pointerDetector) {
      super()
      const
        w = window,
        s = w.sessionStorage,
        self = this,
        /*
          If PointerEvent is detected, pointerEventsInterface is set to 'pointer'.
          If not and if TouchEvent is detected, pointerEventsInterface is set to 'touch'.
          Finally, if neither PointerEvent nor TouchEvent are detected, pointerEventsInterface is set to 'mouse'.
        */
        pointerEventsInterface = this.#data.pointerEventsInterface = (w.PointerEvent) ? 'pointer' : (w.TouchEvent) ? 'touch' : 'mouse'

      //Setting the resulting events names
      this.#data.pointerenter = (pointerEventsInterface == 'touch') ? 'none' : pointerEventsInterface + 'enter'
      this.#data.pointerleave = (pointerEventsInterface == 'touch') ? 'none' : pointerEventsInterface + 'leave'
      this.#data.pointerup = (pointerEventsInterface == 'touch') ? 'touchend' : pointerEventsInterface + 'up'
      this.#data.pointerdown = (pointerEventsInterface == 'touch') ? 'touchstart' : pointerEventsInterface + 'down'
      this.#data.pointermove = pointerEventsInterface + 'move'

      //If not already stored, storing the currentPointerType value in session storage
      if (!s.hasOwnProperty('amst__currentPointerType')) {
        if (pointerEventsInterface == 'pointer') {
          //By default, we consider that touch is used;
          s.setItem('amst__currentPointerType', 'touch')
        } else {//pointerEventsInterface = 'mouse' or pointerEventsInterface = 'touch'
          s.setItem('amst__currentPointerType', pointerEventsInterface)
        }
      }
      this.#currentPointerType = s.getItem('amst__currentPointerType')

      /*
        If the browser supports pointer events API, we have to know whether mouse is used or not to adapt the UI accordingly.
        When a change is detected, the information is send to all its instances.
      */
      if (pointerEventsInterface == 'pointer') {
        //Listening function
        function getPointerType(e) {
          //As long as no change is detected, we leave...
          if (e.pointerType == self.#currentPointerType) return false
          //If the pointer type is now mouse 
          if (e.pointerType == 'mouse') {
            w.removeEventListener('pointermove', getPointerType)
          } else {
            //We listen to the move event which occurred before pointerdown if a mouse is used
            w.addEventListener('pointermove', getPointerType)
          }
          self.#currentPointerType = e.pointerType
          s.setItem('amst__currentPointerType', e.pointerType)
          self.emit('amst__pointerChange')
        }
        if (self.#currentPointerType != 'mouse') w.addEventListener('pointermove', getPointerType)
        w.addEventListener('pointerdown', getPointerType)
      }
      PointerDetector.pointerDetector = this
    }
    return PointerDetector.pointerDetector
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */




  /* -------------------------------------------------------------------------- */
  /*                                   GETTERS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * @getter currentPointerType
   * @returns {string} "mouse" or "touch"
   */
  get currentPointerType() {
    return this.#currentPointerType
  }

  /**
   * @getter data
   * @returns {object}
   * {
   *  pointerEventsInterface : 'touch',
   *  pointerenter: 'none',
   *  pointerleave: 'none',
   *  pointerup: 'touchup',
   *  pointerdown: 'touchdown',
   *  pointermove: 'touchmove'
   * }
   */
  get data() {
    return this.#data
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END GETTERS                                */
  /* -------------------------------------------------------------------------- */
}

//Creating, freezing and exporting an unique instance
const pointerDetector = new PointerDetector()
Object.freeze(pointerDetector)
export default pointerDetector