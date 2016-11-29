export default function createAnchor(href) {
  const a = document.createElement('a')
  a.href = href
  return a
}
