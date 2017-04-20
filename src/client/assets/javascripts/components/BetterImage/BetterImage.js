import React, { Component } from 'react';
import classnames from 'classnames';
import axios from 'app/axios';

export default class BetterImage extends Component {
  componentDidMount () {
    this.image.onerror = () => {
      const fallback = this.props.fallback || '/api/v2/assets/no-album.jpg';
      if (this.image.src !== fallback) {
        this.image.src = fallback;
      }
    }
    if (this.props.src) {
      axios.get(this.props.src, {responseType: 'blob'}).then(({data}) => {
        let url = URL.createObjectURL(data);
        this.image.src = url;
      });
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.src && this.props.src !== nextProps.src) {
      axios.get(nextProps.src, {responseType: 'blob'}).then(({data}) => {
        let url = URL.createObjectURL(data);
        this.image.src = url;
      })
    }
  }
  render() {
    return (
      <div className={classnames('image-container', this.props.divClassName)}
        key={this.props.key}>
        <img className={classnames('better-image', this.props.className)} ref={
            (ref) => this.image = ref
          } style={{
            backgroundImage: `url(/api/v2/assets/oval-min.svg)`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundColor: `#484d5c`,
            display: 'block',
            height: `${this.props.height || this.props.size || 128}px`,
            width: `${this.props.width || this.props.size || 128}px`,
          }} src={this.props.src}/>
      </div>
    );
  }
}
