import React, { PropTypes } from 'react'
import './AlbumResult.scss';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

const AlbumResult = React.createClass({
  render () {
    if (this.props.filter.includes(this.props.item['primary-type'])) {
      return null;
    }
    if (this.props.item.hasMore) {
      return <a className="more" onClick={() => this.props.loadMore()}>
        {this.props.item.count} more results available, expand.
      </a>
    } else if (this.props.item.loadingMore) {
      return <div className="more">
        <div className="spinner">
        <Spinner spinnerName="three-bounce" noFadeIn />
        </div>
      </div>
    }
    return <div className={classnames('artistItem', {
        selected: this.props.item.id === this.props.query,
        anySelected: this.props.query
      })}
      key={this.props.item.id} onClick={
        () => this.props.onSelect(this.props.item.id)
      }>
      <span>{this.props.item.title}</span>
      <div className="dis">
        {this.props.item['primary-type']} by {(this.props.item['artist-credit']
        || [{artist: {name: 'Unknown'}}])[0].artist.name}</div>
    </div>
  }
})

export default AlbumResult
