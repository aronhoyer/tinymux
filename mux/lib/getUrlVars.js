function getUrlVars(path, url) {
  const pathParts = path.split('/')
  const urlParts = url.split('/')

  const vars = {}
  pathParts.forEach((part, i) => {
    if (!part.startsWith) return

    const key = part.split(':')[1]
    if (!key) return

    vars[key] = urlParts[i]
  })

  return vars
}

module.exports = getUrlVars
