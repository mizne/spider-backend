import * as debug from 'debug'
const debugError = debug('Spider:Error')

class Helper {
  public static resolveHref(url: string, href: string): string {
    if (!(url || Helper.isURL(url))) {
      throw new Error(
        `url format not correctly; should be start with http or https; url: ${url}`
      )
    }
    if (!href) {
      return ''
    }
    if (Helper.isURL(href)) {
      return Helper.removeLastSlash(href)
    }

    const [protocal, , host] = url.split('/')
    const hrefTotal = `${protocal}//${host}${
      href.indexOf('/') === 0 ? '' : '/'
    }${href}`
    return Helper.removeLastSlash(hrefTotal)
  }

  public static fullPath(host: string, path: string): string {
    if (!path) {
      return ''
    }
    if (Helper.isURL(path)) {
      return path
    } else {
      return `${host}${path.indexOf('/') === 0 ? '' : '/'}${path}`
    }
  }

  public static resolveTimeFormat(str: string): string {
    // 支持日期格式 2017-12-11、2018/02/13、2018年1月4日
    const DATE_RE = /[\D]*(\d{4})[\D](\d{1,2})[\D](\d{1,2})[\D]*/
    // 支持日期格式 05月15, 2016
    const DATE_RE1 = /[\D]*(\d{1,2})[\D](\d{1,2})[\D]+(\d{4})[\D]*/
    if (DATE_RE.test(str)) {
      const [year, month, day] = str.match(DATE_RE).slice(1, 4)
      return `${year}-${Helper.padZero(month)}-${Helper.padZero(day)}`
    }
    if (DATE_RE1.test(str)) {
      const [month, day, year] = str.match(DATE_RE1).slice(1, 4)
      return `${year}-${Helper.padZero(month)}-${Helper.padZero(day)}`
    }

    throw new Error(`date time format not support; str: ${str}`)
  }

  private static removeLastSlash(url: string): string {
    return url.slice(-1) === '/' ? url.slice(0, -1) : url
  }

  private static isURL(str: string): boolean {
    return /(http|https):\/\/[^\s]*/.test(str.trim())
  }

  private static padZero(str: string, maxLength = 2): string {
    if (str.length > maxLength) {
      throw new Error(
        `str: ${str} length too long than maxLength: ${maxLength};`
      )
    }
    return '0'.repeat(maxLength - str.length) + str
  }
}

export { Helper, debugError }
