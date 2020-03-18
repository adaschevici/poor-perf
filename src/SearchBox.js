import React, { Component } from 'react'
import { books } from './titles.json'

export default class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      searchResults: [],
    }
  }

  getSearchResults = evt => {
    evt.persist()
    const searchResults = books.filter(book =>
      book.originalTitle.includes(evt.target.value)
    )
    this.setState({
      searchTerm: evt.target.value,
      searchResults,
    })
  }

  render() {
    const { searchResults, searchTerm } = this.state
    return (
      <div>
        <input onChange={this.getSearchResults} value={searchTerm} />
        <ul>
          {searchResults.map(book => (
            <li>{book.originalTitle}</li>
          ))}
        </ul>
      </div>
    )
  }
}
