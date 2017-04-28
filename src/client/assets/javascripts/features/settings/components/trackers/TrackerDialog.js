import React, { PropTypes } from 'react';
import {Tooltip, Button, Dialog, Intent} from '@blueprintjs/core';
import classnames from 'classnames';
import FormInput from 'components/FormInput';

const validators = {
  bonus: (n) => {
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
      return '';
    }
    return 'Must be a valid number';
  },
  host: (host) => {
    if (/^https?:\/\//.test(host)) {
      return 'Mustn\'t start with protocol (https)';
    }
    if (/\//.test(host)) {
      return 'Do not include path (/)';
    }
    if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/.test(host) ||
        /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(host)) {
          return '';
        }
    return 'Must be a valid host';
  },
  username: (username) => {
    if (/^[a-z0-9_-]+$/i.test(username)) {
      return '';
    }
    return 'Must be a valid username';
  },
  type:  (type) => {
    if (type === 'undefined') {
      return 'Please select a value';
    }
    return '';
  }
};
class TrackerCard extends React.Component {
  constructor () {
    super();
    this.state = {
      host: '',
      type: '',
      username: '',
      password: '',
      name: '',
      bonus: 0
    }
  }
  componentWillMount () {
    const {tracker, actions} = this.props;
    this.setState({
      name: tracker.name,
      username: tracker.username,
      host: tracker.host,
      type: tracker.type
    });
  }
  componentWillReceiveProps (nextProps) {
    const {tracker, actions} = this.props;
    this.setState({
      name: tracker.name || '',
      username: tracker.username || '',
      host: tracker.host || '',
      status: tracker.status || '',
      type: `${tracker.type}`
    });
  }
  validate (field, value) {
    if (!field) {
      return Object.keys(validators).every((key) =>
        !validators[key](this.state[key])
      );
    }
    if (!validators[field])
      return;
    return validators[field](value);
  }
  handleChange (field) {
    return (event) => {
      this.setState({
        [field]: event.target.value,
        [`${field}Error`]: this.validate(field, event.target.value)
      });
    }
  }
  getIntent (field) {
    return this.state[`${field}Error`] ? 'danger' : undefined;
  }
  submit () {
    const {settings, actions, tracker} = this.props;
    const keys = ['host', 'type', 'username', 'password', 'name', 'bonus'];
    const patches = keys.map((key) => {
      const value = this.state[key];
      return value ? {[key]: value} : {};
    });
    const patch = Object.assign({}, ...patches);
    actions.editTracker(tracker._id, patch);
    actions.openTrackerDialog();
  }
  render () {
    const {settings, actions, tracker} = this.props;
    const status = this.props.tracker.status;
    const indicator = <span className={classnames(
      "pt-icon-standard", {
        'pt-icon-tick tick': status === 'CONFIRMED',
        'pt-icon-cross cross': status === 'INVALID',
        'pt-icon-radial updating': status === 'UPDATING',
        'pt-icon-ring radial': status === 'UNCONFIRMED',
      }
    )}></span>;
    return <Dialog
      iconName="geosearch"
      isOpen={settings.currentTracker === tracker._id}
      onClose={() => {
        actions.openTrackerDialog()
      }}
      title={`Edit tracker - ${this.state.name}`}>
        <div className="pt-dialog-body" style={{
            columnCount: 2,
            margin: '2em'
          }}>
          <FormInput inputId="tracker-name"
            label="Tracker name"
            onChange={this.handleChange('name')}
            value={this.state.name}
            required
            helper={this.state.nameError || "The name is only for the display"} />
          <FormInput inputId="tracker-username"
            label="Username"
            onChange={this.handleChange('username')}
            value={this.state.username}
            intent={this.getIntent('username')}
            required
            helper={this.state.usernameError || "Username used to login into your tracker"} />
          <FormInput inputId="tracker-password"
            label="Password"
            onChange={this.handleChange('password')}
            value={this.state.password}
            placeholder="Type to edit current password"
            type="password"
            helper="Password used to login into your tracker" />
          <FormInput inputId="tracker-type"
            label="Tracker type"
            placeholder="Type to edit current password"
            required
            intent={this.getIntent('type')}
            helper={this.state.nameError || "Which tracker is it"}>
            <div className="pt-select">
              <select onChange={this.handleChange('type')} value={this.state.type}>
                <option value="undefined">Please choose...</option>
                <option value="gazelle">Gazelle</option>
                <option value="t411">T411</option>
              </select>
            </div>
          </FormInput>
          <FormInput inputId="tracker-host"
            label="Host"
            onChange={this.handleChange('host')}
            value={this.state.host}
            intent={this.getIntent('host')}
            placeholder="mytracker.io"
            helper={this.state.hostError || "Base URL pointing to your tracker"} />
          <FormInput inputId="tracker-bonus"
            label="Bonus"
            intent={this.getIntent('bonus')}
            onChange={this.handleChange('bonus')}
            value={this.state.bonus}
            placeholder="Type to edit current bonus"
            helper={this.state.bonusError || "Sorting and filter bonus"} />
        </div>
        <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
                <Button text="Cancel" onClick={() =>
                    actions.openTrackerDialog()} />
                <Button
                    intent={Intent.PRIMARY}
                    onClick={this.submit.bind(this)}
                    disabled={!this.validate()}
                    text="Save" />
            </div>
        </div>
    </Dialog>;
  }
}

export default TrackerCard;
