import * as debug from 'debug'

export interface LogOptions {
  beginDesc?: string
  successDesc?: string
  failureDesc?: string
}

export function log(options: LogOptions = {}) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalFn = descriptor.value as Function
    const className = target.constructor.name
    const debugLog = debug(className)

    const beginDesc =
      options.beginDesc || `${propertyKey} method begining...`
    const successDesc =
      options.successDesc || `${propertyKey} method success!`
    const failureDesc =
      options.failureDesc || `${propertyKey} method failure!`
    descriptor.value = async function(...args: any[]) {
      debugLog(beginDesc)
      try {
        const result = await originalFn.apply(this, args)
        debugLog(successDesc)
        return result
      } catch (e) {
        debugLog(`${failureDesc} error: ${e.message};`)
        throw e
      }
    }
  }
}

