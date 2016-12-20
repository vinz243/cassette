import React, { Component, PropTypes } from 'react';

import './ToolbarApp.scss';

export default class ToolbarLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    friends: PropTypes.object.isRequired
  };

  render() {
    const { friends: { friendsById }, actions } = this.props;

    return (
    );
  }
}
