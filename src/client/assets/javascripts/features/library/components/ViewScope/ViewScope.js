import React, { Component, PropTypes } from 'react';
import './ViewScope.scss';
import {Row, Col, Card} from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router';
export default class ViewScope extends Component {
  render() {
    return <div className="scopeSwitcher">
      <span className={classnames('scopeSwitcherItem', {
        'selected': this.props.selection === 'artists'
      })}>
        <Link to='/app/library/artists'>ARTISTS</Link>
      </span>
      <span className={classnames('scopeSwitcherItem', {
        'selected': this.props.selection === 'albums'
      })}>
        <Link to='/app/library/albums'>ALBUMS</Link>
      </span>
      <span className={classnames('scopeSwitcherItem', {
        'selected': this.props.selection === 'tracks'
      })}>
        <Link to='/app/library/tracks'>TRACKS</Link>
      </span>
      <span className="customTitle">
        {this.props.title || 'All'}
      </span>
    </div>
  }
}
