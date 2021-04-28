//cSpell:words amst


/**
 * @class Nodal
 * @description Singleton 
 * Append a div <div class="amst__hidden" data-role="amst__nodal"></div> to the body
 * Called in audioUI
 * Used to display the available settings on screens whose width or height are less than 720px.
 */


class Nodal {
  /**
   * @private {Boolean} #visible - Stores the visible
   */
  #visible = false


  /**
   * PROPERTIES
   * @property container - DIV container
   */

  /**
   * METHODS
   * @method show()
   * @param {String} html
   * @description : fills container with html parameter and shows the nodal
   * 
   * @method hide()
   * @description : empties container and hides the nodal
   */

  /**
   * GETTER
   * @get visible()
   * @return {Boolean} true if the nodal is visible, false if not
   */

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor() {
    //If first instantiation
    if (!Nodal.nodal) {
      this.container = document.createElement('div')
      this.container.classList.add('amst__hidden')
      this.container.setAttribute('data-role', 'amst__nodal')
      document.body.appendChild(this.container)
      Nodal.nodal = this
    }
    return Nodal.nodal
  }
  /* -------------------------------------------------------------------------- */
  /*                               END CONSTRUCTOR                              */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   METHODS                                  */
  /* -------------------------------------------------------------------------- */
  /**
   * @method show()
   * @param {String} html
   * @description : fills container with html parameter and shows the nodal
   */
  show(html) {
    this.container.innerHTML = html
    this.container.classList.remove('amst__hidden')
    document.body.classList.add('amst__overflow-hidden')
    this.#visible = true
  }

  /**
   * @method hide()
   * @description : empties container and hides the nodal
   */
  hide() {
    this.container.innerHTML = ''
    this.container.classList.add('amst__hidden')
    document.body.classList.remove('amst__overflow-hidden')
    this.#visible = false
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END METHODS                                */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   GETTER                                   */
  /* -------------------------------------------------------------------------- */
  /**
   * @get visible()
   * @return {Boolean} true if the nodal is visible, false if not
   */
  get visible() {
    return this.#visible
  }
  /* -------------------------------------------------------------------------- */
  /*                                 END GETTER                                 */
  /* -------------------------------------------------------------------------- */
}

//Creating, freezing and exporting an unique instance
const nodal = new Nodal()
Object.freeze(nodal)
export default nodal