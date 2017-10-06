import React, { Component, PropTypes } from 'react';
import './ImageCard.scss';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
import LoaderProxy from '../LoaderProxy';
import shortid from 'shortid';
import BetterImage from 'components/BetterImage';

export default class ImageCard extends Component {
  componentDidMount() {
  }
  render() {
    return <div className="imageCard" key={this.props.key || shortid.generate()}
      onClick={() => {browserHistory.push(this.props.link)}}>
      <div className="image">
        <BetterImage src={this.props.image} size={120}/>
      </div>
      <div className="description" ref={(ref) => {this.desc = ref}}>
        <div className="title">
          {this.props.title}
        </div>
        <div className="caption">
          {this.props.caption}
        </div>
      </div>
    </div>
  }
}
