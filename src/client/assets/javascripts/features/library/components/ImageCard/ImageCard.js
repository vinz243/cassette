import React, { Component, PropTypes } from 'react';
import './ImageCard.scss';
import classnames from 'classnames';
import { browserHistory } from 'react-router';
import LoaderProxy from '../LoaderProxy';
import shortid from 'shortid';
import Vibrant from 'node-vibrant';

export default class ImageCard extends Component {
  componentDidMount() {
    this.img.addEventListener('load', () => {
      var vibrant = new Vibrant(this.img);
      var swatches = vibrant.swatches();
      this.desc.style.backgroundColor = swatches.Muted.getHex();

      /*
       * Results into:
       * Vibrant #7a4426
       * Muted #7b9eae
       * DarkVibrant #348945
       * DarkMuted #141414
       * LightVibrant #f3ccb4
       */
     });
  }
  render() {
    return <div className="imageCard" key={this.props.key || shortid.generate()}
      onClick={() => {browserHistory.push(this.props.link)}}>
      <div className="image">
        <img src={this.props.image} ref={(ref) => {this.img = ref}} width="100%"/>
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
