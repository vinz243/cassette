import React, { PropTypes } from 'react'
import './ScrollableDiv.scss';

class ScrollableDiv extends React.Component {
  componentDidMount () {
    window.addEventListener('resize', (evt) => {
      window.requestAnimationFrame(() => {
        this.updateHeight();
      })
    });
    this.updateHeight();
  }
  updateHeight () {
    this.div.style.height =
      (window.innerHeight
        - this.div.getBoundingClientRect().top
        + (this.props.offset || 0)
        - this.div.parentElement.scrollTop) + "px";
  }
  componentDidUpdate () {
    this.updateHeight();
  }
  render () {
    return <div ref={(ref) => this.div = ref} className="scrollable-div">
      {this.props.children}
    </div>
  }
}

export default ScrollableDiv;
