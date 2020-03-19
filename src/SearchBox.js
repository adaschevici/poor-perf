import React, { Component } from 'react'
import styles from './SearchBox.css'
import WorkerArrayController from './worker-array'
import { books } from './titles.json'
import { List } from 'react-virtualized'

class ReactVirtualizedList extends Component {
  static defaultProps = {
    searchResults: [],
  }
  constructor(props) {
    super(props)
    this.listHeight = 600
    this.rowHeight = 50
    this.rowWidth = 800
  }

  renderRow = ({ index, key, style }) => {
    return (
      <div key={key} style={style} className={styles.row}>
        <div className={styles.content}>
          <div>{this.props.searchResults[index].id}</div>
          <div>{this.props.searchResults[index].originalTitle}</div>
        </div>
      </div>
    )
  }

  render() {
    const { rowHeight, rowWidth, listHeight } = this
    const { searchResults } = this.props
    return (
      <List
        width={rowWidth}
        height={listHeight}
        rowHeight={rowHeight}
        rowRenderer={this.renderRow}
        rowCount={searchResults.length}
        overscanRowCount={3}
      />
    )
  }
}

class SearchResults extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
    }
    this.workerArray = new WorkerArrayController({
      data: books,
      handleResults: this.handleResults,
      arraySize: 4,
    })
  }

  componentDidUpdate(prevProps) {
    const { searchTerm } = this.props
    if (searchTerm && searchTerm !== prevProps.searchTerm) {
      this.workerArray.search({ searchTerm })
    }
  }

  handleResults = evt => {
    const { searchResults } = evt.data
    this.setState({
      searchResults,
    })
  }

  render() {
    return <ReactVirtualizedList searchResults={this.state.searchResults} />
  }
}

export default class SearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
    }
  }

  render() {
    return (
      <div>
        <input
          onChange={e => this.setState({ searchTerm: e.target.value })}
          value={this.state.searchTerm}
        />

        <SearchResults searchTerm={this.state.searchTerm} />
      </div>
    )
  }
}
