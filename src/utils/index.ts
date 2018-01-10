const isURL = (link: string): boolean =>
  /(http|https):\/\/[^\s]*/.test(link.trim())

const fullPath = (host: string, path: string): string => {
  if (!path) {
    return ''
  }
  if (isURL(path)) {
    return path
  } else {
    return `${host}${path.indexOf('/') === 0 ? '' : '/'}${path}`
  }
}

const resolveHref = (url: string, href: string): string => {
  if (!(url || isURL(url))) {
    throw new Error(
      `url format not correctly; should be start with http or https; url: ${url}`
    )
  }
  if (!href) {
    return ''
  }
  if (isURL(href)) {
    return href
  }

  const [protocal, , host] = url.split('/')
  const hrefTotal = `${protocal}//${host}${
    href.indexOf('/') === 0 ? '' : '/'
  }${href}`
  return hrefTotal.slice(-1) === '/' ? hrefTotal.slice(0, -1) : hrefTotal
}

const extractRegularTime = (str: string): string => {
  // 支持日期格式 2017-12-11、2018/02/13、2018年1月4日
  const DATE_RE = /[\D]*(\d{4})[\D](\d{1,2})[\D](\d{1,2})[\D]*/
  // 支持日期格式 05月15, 2016
  const DATE_RE1 = /[\D]*(\d{1,2})[\D](\d{1,2})[\D]+(\d{4})[\D]*/
  if (DATE_RE.test(str)) {
    const [year, month, day] = str.match(DATE_RE).slice(1, 4)
    return `${year}-${month}-${day}`
  }
  if (DATE_RE1.test(str)) {
    const [month, day, year] = str.match(DATE_RE1).slice(1, 4)
    return `${year}-${month}-${day}`
  }

  throw new Error(`date time format not support; str: ${str}`)
}

export { resolveHref, fullPath, extractRegularTime }
