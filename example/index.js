import Asyncr from '../src'

Asyncr.configure({ containerSelector: '#container' })
Asyncr.onTransitionStart(el => el.cssText = `
  transition: all .2s ease;
  opacity: 0
`)
Asyncr.willRender(html => {
  
})
Asyncr.onTransitionEnd(el => el.cssText = `
  opacity: 1
`)
// Asyncr.onTransitionStart(state => Asyncr.transition(state.url || '/'))
Asyncr.jackAnchorAll()
// const onDOMContentLoaded = () => Asyncr.jackAnchorAll()
// window.addEventListener('DOMContentLoaded', onDOMContentLoaded)
