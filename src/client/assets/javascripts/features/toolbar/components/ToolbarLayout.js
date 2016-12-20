import React, { Component, PropTypes } from 'react';

import './ToolbarApp.scss';

export default class ToolbarLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { toolbar, actions } = this.props;
    console.log(this.props, toolbar);
    return (
    	<div>
    		Hello there!
    	</div>
    );
  }
}
