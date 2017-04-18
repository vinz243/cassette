import React, { PropTypes } from 'react'
import {Button} from '@blueprintjs/core';
import './ConfigureView.scss';
import classnames from 'classnames';
import {push} from 'react-router-redux';

class ConfigureView extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  render () {
    const {actions, history} = this.props;
    return <div className="configure-content">
      <div className="configure-header">
        <h3>Welcome to cassette 1.0!</h3>
      </div>
      <div className="configure-content">
        <p>
          You probably just updated or installed cassette.
          You can now start configuring it quickly.
          Just click on the Configure button to get started!
        </p>
        <p>
          This should be really quick and allows you to secure your cassette
          installation by choosing a login. It will also make sure everything
          is working as it should and correctly set.
        </p>
        <p>
          If you are updating, you will loose your libraries (but not the content!),
          but there are so many new features that it will be totally worth it!
          Amongst which currently playing management, differential library
          scanning for faster scans, better music downloading,
          multiple trackers support and faster and smoother frontend!
        </p>
        <div className="configure-button">
          <Button rightIconName="arrow-right" className="pt-large"
            text="Configure" loading={
              false
            } onClick={() => this.context.router.push('/configure')}/>
        </div>
      </div>
    </div>
  }
}

export default ConfigureView;
