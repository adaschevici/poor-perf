function SearchEngine(data) {
  this.books = data
}

SearchEngine.prototype.search = function(term) {
  const results = this.books.filter(book => book.originalTitle.includes(term))
  console.log(results, term)
  return results
}

let searchEngine
let port

function initiate(data, portData) {
  searchEngine = new SearchEngine(data)
  port = portData
  port.onmessage = search
}

/* search is attached to the port as the message handler so it
runs when communicating with the workerArray only */
function search(e) {
  const { searchTerm } = e.data
  const message = {
    searchResults: searchEngine.search(searchTerm),
  }
  port.postMessage(message)
}

/* self.onmessage is the handler that responds to messages from
the main thread, which only fires during initiation */
self.onmessage = function(e) {
  const { data } = e.data
  initiate(data, e.ports[0])
}
