import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as configurationActions, selector } from '../';
import { createStructuredSelector } from 'reselect';
import ConfigurationLayout from './ConfigurationLayout';

@connect(createStructuredSelector({
  configuration: (state) => state['configuration']
}), (dispatch) => ({
  actions: bindActionCreators(configurationActions, dispatch)
}))

class ConfigurationView extends React.Component {
  render () {
    return <div className="configuration-view">
      <ConfigurationLayout {...this.props} />
    </div>
  }
}

export default ConfigurationView;
