import React, { Component, PropTypes } from 'react';
import './PlaylistApp.scss';

export default class PlaylistLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  constructor() {
    super();
  }

  render() {
    const { playlist, actions } = this.props;
    console.log(this);
    return (
    	<div className="playlistView">

      </div>
    );
  }
}
