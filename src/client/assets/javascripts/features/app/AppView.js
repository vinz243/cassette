import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ToolbarView from 'features/toolbar/components/ToolbarView';
import LibraryView from 'features/library/components/LibraryView';

export default class AppView extends Component {
  render() {
    return (
      <div>
        <ToolbarView {...this.props} />
        <LibraryView />
      </div>
    );
  }
}
