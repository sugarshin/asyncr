import AsyncEmitter from './AsyncEmitter'
import isInternalURL from './utils/isInternalURL'
import htmlParser from './utils/htmlParser'
import createAnchor from './utils/createAnchor'

export default new class Asyncr extends AsyncEmitter {
  get containerSelector() {
    return this._containerSelector
  }

  set containerSelector(selector) {
    this._containerSelector = selector
  }

  get _defaultConfig() {
    return {
      containerSelector: '#container'
    }
  }

  handleEmitChangeEnd = () => this._transitioning = false

  handleJackedAnchorClick = e => {
    const { href } = e.target
    if (isInternalURL(href)) {
      e.preventDefault();
      if (!this._transitioning) {
        this._transitioning = true
        const url = createAnchor(href).pathname
        const state = { url }
        const attr = e.target.getAttribute('data-asyncr')
        if (attr) {
          state.data = this.parseAttributeOrDefault(attr)
        }
        window.history.pushState(state, null, url)
        // this.emitStateChange(state).then(this.handleEmitChangeEnd)
      }
    }
  }

  constructor() {
    super()
    window.addEventListener('popstate', e => this.emitStateChange(e.state || {}))
  }

  /**
   * @private
   * @param {...*} args
   * @returns {Promise}
   */
  emitStateChange(...args) {
    return this.emit('change', ...args)
  }

  /**
   * @private
   * @param {String} html
   */
  offChange(listener) {
    this.removeListener('change', listener);
  }

  /**
   * @private
   * @param {String} html
   */
  pickContainerInnerHTML(html) {
    const doc = htmlParser(html)
    return doc.querySelector(this.containerSelector).innerHTML
  }

  /**
   * @private
   * @param {String} html
   * @returns {Promise}
   */
  handleFetchHTMLSuccess(html) {
    return new Promise((resolve, reject) => {
      try {
        this.unjackAnchorAll()
        this.renderContent(html)
        this.jackAnchorAll()
        resolve()
      } catch (e) {
        reject(e)
      }
    });
  }

  /**
   * @private
   * @param {String} html
   */
  renderContent(html) {
    document.querySelector(this.containerSelector).innerHTML = this.pickContainerInnerHTML(html)
  }

  /**
   * @private
   * @param {*} attr
   * @returns {Object|*}
   */
  parseAttributeOrDefault(attr) {
    try {
      return JSON.parse(attr)
    } catch (err) {
      return attr
    }
  }

  /**
   * @public
   */
  configure(config = {}) {
    this.containerSelector = config.containerSelector || this._defaultConfig.containerSelector
  }

  /**
   * @public
   * @param {Function} listener
   */
  onChange(listener) {
    this.on('change', listener)
  }

  onTransitionStart(listener) {
    this.on('transitionstart', listener)
  }

  onTransitionEnd(listener) {
    this.on('transitionend', listener)
  }

  /**
   * @public
   * @param {String} url
   * @returns {Promise}
   */
  transition(url) {
    return fetch(url).then(res => res.text()).then(html => this.handleFetchHTMLSuccess(html))
  }

  /**
   * @public
   */
  jackAnchorAll() {
    Array.from(document.querySelectorAll('a')).forEach(el => el.addEventListener('click', this.handleJackedAnchorClick))
  }

  /**
   * @public
   */
  unjackAnchorAll() {
    Array.from(document.querySelectorAll('a')).forEach(el => el.removeEventListener('click', this.handleJackedAnchorClick))
  }
}
