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

export { fullPath }
