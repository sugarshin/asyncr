import createAnchor from './createAnchor'

export default function isInternalURL(href) {
  return href.indexOf(rootURL) === 0
}

const rootURL = (() => createAnchor('/').href)()
