import React, { Component, PropTypes } from 'react';
import './PlaylistApp.scss';

import DraggableList from 'react-draggable-list';
import PlaylistItem from './PlaylistItem';

export default class PlaylistLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  constructor() {
    super();
  }
  componentDidMount () {
    // let last_known_scroll_position = 0;
    // let ticking = false;
    // let div = this.div;

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
  onMoveEnd (array, obj, from, to) {
    const { playlist, actions } = this.props;
    actions.move(from, to);
  }
  render() {
    const { playlist, actions } = this.props;

    const items = playlist.nextStack.map((track, index) => {
      return <div>{track.name}</div>
    });

    return (
      <div>
        {playlist.current.name ? <PlaylistItem item={
            playlist.current
          } style={{
            margin: '10px 28px 0 22px',
            boxShadow: `rgba(0, 0, 0, 0.3) 0px 4px 8px 0px`
          }} dragHandle={() => {
            return <span className="pt-icon-standard pt-icon-volume-up" style={{
              float: 'left',
              marginTop: '6px',
              fontSize: '14px'
            }}></span>}
          } itemSelected={0} playing/> : ''}
        <div className="playlistView" ref={(ref) => this.div = ref}>
          <DraggableList
            list={playlist.nextStack}
            itemKey="_id"
            template={PlaylistItem}
            onMoveEnd={this.onMoveEnd.bind(this)}
            container={() => this.div} />
        </div>
        {playlist.current.album ?
          <img src={`/api/v2/albums/${
              playlist.current.album._id
            }/artwork?size=300`} /> :
          <span className="pt-icon-standard pt-icon-pulse"></span>}
      </div>
    );
  }
}
