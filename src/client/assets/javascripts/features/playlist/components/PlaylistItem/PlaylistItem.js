import React, { Component, PropTypes } from 'react';
import './PlaylistItem.scss';
import classnames from 'classnames';

export default class PlaylistItem extends Component {
  componentDidMount() {
  }
  render() {
    const {item, dragHandle, itemSelected, playing, anySelected} = this.props;

    const scale = itemSelected * 0.05 + 1;
    const shadow = itemSelected * 15 + 1;
    const dragged = itemSelected !== 0;

    return <div className={classnames("playlistItem", {dragged, playing})}
      style={Object.assign({}, {
          transform: `scale(${scale})`,
          boxShadow: `rgba(0, 0, 0, 0.3) 0px ${shadow}px ${2 * shadow}px 0px`
      }, this.props.style)}
      onClick={() => dragged || this.props.commonProps.play(item._id)}>
      {dragHandle(
        <span className="dragHandle pt-icon-drag-handle-vertical pt-icon-standard"></span>
      )}
      <div className="title">{item.name}</div>
      <div className="artist" style={{
          // height: `${(1 - anySelected) * 26}px`
        }}>{item.artist.name}</div>
    </div>
  }
}
