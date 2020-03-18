const express = require('express')
const { books } = require('./titles.json')
const bodyParser = require('body-parser')
const app = express()
const port = 5000

class SearchEngine {
  constructor() {
    this.books = books
  }

  search = term => {
    return this.books.filter(book => book.originalTitle.includes(term))
  }
}

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

app.route('/search').post(bodyParser.json(), (req, res) => {
  const { searchTerm } = req.body

  console.log(req.body)
  const engine = new SearchEngine()

  const searchResults = engine.search(searchTerm)

  res.send({ searchResults })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
