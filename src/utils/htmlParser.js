const domParser = new DOMParser()

export default function htmlParser(string) {
  return domParser.parseFromString(string, 'text/html')
}
