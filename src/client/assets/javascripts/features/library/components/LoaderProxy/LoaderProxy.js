import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import './LoaderProxy.scss';

export default class LoaderProxy extends Component {
  componentDidMount() {

    var elem = ReactDom.findDOMNode(this);
  	// Set the opacity of the element to 0
  	elem.style.opacity = 0;
  	window.requestAnimationFrame(function() {
  		// Now set a transition on the opacity
  		elem.style.transition = "opacity 100ms";
  		// and set the opacity to 1
  		elem.style.opacity = 1;
  	});
  }
  render() {
    if (this.props.library.loading) {
      return (
        <div className="loadingPage">
          <div className="lp-sk-folding-cube">
            <div className="lp-sk-cube1 lp-sk-cube"></div>
            <div className="lp-sk-cube2 lp-sk-cube"></div>
            <div className="lp-sk-cube4 lp-sk-cube"></div>
            <div className="lp-sk-cube3 lp-sk-cube"></div>
          </div>
          <div className="text">
            Loading content...
          </div>
        </div>
      )
    }
    return (<div>
      {this.props.children}
    </div>)
  }
}
