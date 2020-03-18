function SearchEngine(data) {
  this.books = data
}

SearchEngine.prototype.search = function(term) {
  console.log(this.books)
  return this.books.filter(book => book.originalTitle.includes(term))
}

let searchEngine
let cache = {}
//thought I would add a simple cache... Wait till you see those deletes now :)

function initiateSearchEngine(data) {
  //initiate the search engine with the 13,000 item data set
  searchEngine = new SearchEngine(data)
  //reset the cache on initiate just in case
  cache = {}
}

function confirmSearch(searchTerm) {
  self.postMessage({ confirmSearch: searchTerm })
}

function search(searchTerm) {
  const cachedResult = cache[searchTerm]
  if (cachedResult) {
    self.postMessage(cachedResult)
    return
  }
  const message = {
    searchResults: searchEngine.search(searchTerm),
  }
  cache[searchTerm] = message
  //self.postMessage is the api for sending messages to main thread
  self.postMessage(message)
}

/*self.onmessage is where we define the handler for messages recieved
from the main thread*/
self.onmessage = function(e) {
  const { data, searchTerm, confirmed } = e.data

  /*We can determine how to respond to the .postMessage from 
  SearchResults.js based on which data properties it has:*/
  if (data) {
    initiateSearchEngine(data)
  } else if (searchTerm) {
    confirmed ? search(searchTerm) : confirmSearch(searchTerm)
  }
}
