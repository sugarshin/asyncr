import { EventEmitter } from 'events'
import isPromise from './utils/isPromise'

export default class AsyncEmitter extends EventEmitter {
  emit(event, ...args) {
    return Promise.all(this.listeners(event).map(l => {
      let p;
      try {
        p = l(...args)
      } catch (error) {
        return new Promise((_, reject) => reject(error))
      }
      return isPromise(p) ? p : new Promise(resolve => resolve(p))
    }))
  }
}
