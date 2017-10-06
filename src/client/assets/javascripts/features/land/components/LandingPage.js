import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as configurationActions, selector } from '../';
import { createStructuredSelector } from 'reselect';
import classnames from 'classnames';
import './LandingApp.scss';
import LoginView from './LoginView';
import ConfigureView from './ConfigureView';

@connect(createStructuredSelector({
  land: (state) => state['land']
}), (dispatch) => ({
  actions: bindActionCreators(configurationActions, dispatch)
}))
class LandingPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  componentDidMount() {
    this.props.actions.fetchStatus();
  }
  componentWillReceiveProps(nextProps) {
    const {land} =  nextProps;
    if (land.loggedIn) {
      this.context.router.push('/app/library');
    }
  }
  render () {
    const {actions, land} = this.props;
    return <div className="landing-layout pt-dark">
      <div className={classnames("landing-container", {
          'loaded': !land.loading
        })}>
        {land.configured ? land.loggedIn ? null : <LoginView {...this.props} />
      : <ConfigureView {...this.props} />}
      </div>
    </div>
  }
}

export default LandingPage;
