import React, { PropTypes } from 'react'
import './ConfigurationApp.scss';
import classnames from 'classnames';
import ChecksView from './checks';
import LoginView from './login';
import LibrariesView from './libraries';
import {Button, Intent} from '@blueprintjs/core';

class ConfigurationLayout extends React.Component {
  configurationStep () {
    const {configuration, actions} = this.props;
    return {
      'checks': {
        render: () => (<ChecksView {...this.props} />),
        name: 'System requirements checklist',
        desc: 'Cassette will make sure system requirements are met',
        loading: configuration.checksProcessing,
        valid: configuration.checksPassed
      },
      'login': {
        render: () => (<LoginView {...this.props} />),
        name: 'Login configuration',
        customButtons: true,
        desc: (<span><div>You can now secure your cassette instance by setting a login.</div>
          <div>This is mandatory and <b>not</b> related to tracker credentials.</div></span>)
      },
      'libraries': {
        render: () => (<LibrariesView {...this.props} />),
        name: 'Libraries configuration',
        desc: 'You can choose where cassette will look for your music'
      },
      'trackers': {
        render: () => (<div className="trackers">
          Please checkout the settings once you're done.
        </div>),
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
          <h3>{step.name}</h3>
          <div className="configuration-description">{step.desc}</div>
        </div>
        <div className="configuration-content">
          {step.render()}
          {step.customButtons ? null : <div className="configuration-next">
            <Button iconName="arrow-left" className="pt-large pt-minimal"
              text="Previous" onClick={actions.prevStep}/>
            <Button rightIconName="arrow-right" className="pt-large"
              text="Next" onClick={actions.nextStep} disabled={
                !step.valid 
              } loading={
                step.loading
              }/>
          </div>}
        </div>
      </div>
    })
    return <div className="configuration-layout">
      {steps}
    </div>
  }
}

export default ConfigurationLayout;
