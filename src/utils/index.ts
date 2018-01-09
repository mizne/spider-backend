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
    throw new Error(`url format not correctly; should be start with http or https; url: ${url}`)
  }
  if (!href) {
    return ''
  }
  if (isURL(href)) {
    return href
  }
  
  const [protocal, , host] = url.split('\/')
  return `${protocal}//${host}${href.indexOf('/') === 0 ? '' : '/'}${href}`
}

export { resolveHref, fullPath }
