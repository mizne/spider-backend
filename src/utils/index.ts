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

const extractRegularTime = (str: string) => {
  const DATE_RE = /[\d]*(\d{4})[\D](\d{1,2})[\D](\d{1,2})[\D]*/
  if (DATE_RE.test(str)) {
    return str
      .match(DATE_RE)[0]
      .replace(/(\D+)/g, () => {
        return '-'
      })
      .replace(/\D$/, () => '')
  }

  throw new Error(`date time format not support; str: ${str}`)
}

export { resolveHref, fullPath, extractRegularTime }
