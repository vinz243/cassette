import React, { PropTypes } from 'react'
import './ConfigurationApp.scss';
import classnames from 'classnames';
import ChecksView from './checks';
import {Button, Intent} from '@blueprintjs/core';

class ConfigurationLayout extends React.Component {
  configurationStep () {
    return {
      'checks': {
        render: () => (<ChecksView {...this.props} />),
        name: 'System requirements check',
        desc: 'Cassette will make sure system requirements are met'
      },
      'login': {
        render: () => (<ChecksView {...this.props} />),
        name: 'Login configuration',
        desc: 'You can now secure your cassette instance by setting a login'
      },
      'libraries': {
        render: () => (<ChecksView {...this.props} />),
        name: 'Libraries configuration',
        desc: 'You can choose where cassette will look for your music'
      },
      'trackers': {
        render: () => (<ChecksView {...this.props} />),
        name: 'Trackers configuration',
        desc: 'Choose which trackers you want to download your music from (optionnal)'
      },
    }
  }
  render () {
    const {configuration, actions} = this.props;
    const steps = configuration.steps.map((stepName) => {
      const step = this.configurationStep()[stepName];
      const allSteps = configuration.steps;
      return <div className={classnames("configuration-container", {
          active: stepName === configuration.currentStep,
          next: allSteps.indexOf(stepName) > allSteps.indexOf(configuration.currentStep)
        })}>
        <div className="configuration-header">
          <h2>{step.name}</h2>
        </div>
        <div className="configuration-content">
          {step.render()}
          <div className="configuration-next">
            <Button rightIconName="arrow-right" className="pt-large"
              text="Next" onClick={actions.nextStep}/>
          </div>
        </div>
      </div>
    })
    return <div className="configuration-layout">
      {steps}
    </div>
  }
}

export default ConfigurationLayout;
