import React, { Component, PropTypes } from 'react';
import './PlaylistApp.scss';

export default class PlaylistLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  constructor() {
    super();
  }
  componentDidMount () {
    let last_known_scroll_position = 0;
    let ticking = false;
    let div = this.div;

    // function onScroll(scroll_pos) {
    //   div.style.paddingTop = scroll_pos + 'px';
    // }
    //
    // window.addEventListener('scroll', function(e) {
    //   last_known_scroll_position = window.scrollY;
    //   if (!ticking) {
    //     window.requestAnimationFrame(function() {
    //       onScroll(last_known_scroll_position);
    //       ticking = false;
    //     });
    //   }
    //   ticking = true;
    // });
  }
  render() {
    const { playlist, actions } = this.props;

    const items = playlist.nextStack.map((track, index) => {
      return <div>{track.name}</div>
    });

    return (
    	<div className="playlistView" ref={(ref) => this.div = ref}>
        {items}
      </div>
    );
  }
}
