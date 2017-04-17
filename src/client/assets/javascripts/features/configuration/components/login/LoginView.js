import React, { PropTypes } from 'react'
import './LoginView.scss';
import classnames from 'classnames';
import {Button, Intent} from '@blueprintjs/core';

class LoginView extends React.Component {
  constructor () {
    super();
    this.state = {
      username: '',
      password: '',
      confpass: ''
    }
  }
  handleUsernameChange(evt) {
    this.setState({
      username: evt.target.value,
      usernameChanged: true
    });
  }
  handlePasswordChange(evt) {
    this.setState({
      password: evt.target.value,
      passwordChanged: true
    });
  }
  handleConfPassChange(evt) {
    this.setState({
      confpass: evt.target.value,
      confpassChanged: true
    });
  }
  render () {
    const {configuration, actions} = this.props;
    return <div className="configuration-login-view">
      <div className={classnames("pt-form-group", {
        'pt-intent-danger': (this.state.usernameChanged || this.state.passwordChanged )
          && this.state.username.length < 4
      })}>
        <label className="pt-label" for="input-username">
          Username
          <span className="pt-text-muted">(required)</span>
        </label>
        <div className="pt-form-content">
          <input
            value={this.state.username}
            onChange={this.handleUsernameChange.bind(this)}
            id="input-username"
            className={classnames("pt-input", {
              'pt-intent-danger': (this.state.usernameChanged || this.state.passwordChanged )
                && this.state.username.length < 4
            })}
            placeholder="username"
            type="text"
            dir="auto" />
          <div className="pt-form-helper-text">4 characters at least required</div>
        </div>
      </div>
      <div className={classnames("pt-form-group", {
        'pt-intent-danger': this.state.passwordChanged
          && this.state.password.length < 8
      })}>
        <label className="pt-label" for="input-password">
          Password
          <span className="pt-text-muted">(required)</span>
        </label>
        <div className="pt-form-content">
          <input
            value={this.state.password}
            onChange={this.handlePasswordChange.bind(this)}
            id="input-password"
            className={classnames("pt-input", {
             'pt-intent-danger': this.state.passwordChanged
               && this.state.password.length < 8
             })}
            placeholder="password"
            type="password"
            dir="auto" />
          <div className="pt-form-helper-text">Choose a long secure password</div>
        </div>
      </div>
      <div className={classnames("pt-form-group", {
          'pt-intent-danger': this.state.password !== this.state.confpass
        })}>
        <label className="pt-label" for="input-password-confirmation">
          Password Confirmation
          <span className="pt-text-muted">(required)</span>
        </label>
        <div className="pt-form-content">
          <input
            id="input-password-confirmation"
            value={this.state.confpass}
            onChange={this.handleConfPassChange.bind(this)}
            className={classnames("pt-input", {
               'pt-intent-danger': this.state.password !== this.state.confpass
             })}
            placeholder="password"
            type="password"
            dir="auto" />
        </div>
      </div>
      <div className="configuration-next">
        <Button iconName="arrow-left" className="pt-large pt-minimal"
          text="Previous" onClick={actions.prevStep}/>
        <Button rightIconName="arrow-right" className="pt-large"
          text="Next" onClick={actions.nextStep} disabled={
            this.state.password !== this.state.confpass ||
            this.state.password.length < 8 ||
            this.state.username.length < 4
          } loading={
            false
          }/>
      </div>
    </div>
  }
}

export default LoginView;
