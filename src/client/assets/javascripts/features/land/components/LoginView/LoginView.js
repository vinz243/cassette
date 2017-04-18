import React, { PropTypes } from 'react'
import {Button} from '@blueprintjs/core';
import './LoginView.scss';
import classnames from 'classnames';

class LoginView extends React.Component {
  constructor () {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }
  handleUsernameChange(evt) {
    this.setState({
      username: evt.target.value
    });
  }
  handlePasswordChange(evt) {
    this.setState({
      password: evt.target.value
    });
  }
  render () {
    return <div className="login-content">
      <div className="login-header">
        <h3>Welcome back on cassette!</h3>
      </div>
      <div className="login-content">
        <div className={classnames("pt-form-group", {
          'pt-intent-danger': false
        })}>
          <label className="pt-label" for="input-username">
            Username
          </label>
          <div className="pt-form-content">
            <input
              value={this.state.username}
              onChange={this.handleUsernameChange.bind(this)}
              id="input-username"
              className={classnames("pt-input", {
                'pt-intent-danger': false
              })}
              placeholder="admin"
              type="text"
              dir="auto" />
          </div>
        </div>
        <div className={classnames("pt-form-group", {
          'pt-intent-danger': this.state.passwordChanged
            && this.state.password.length < 8
        })}>
          <label className="pt-label" for="input-password">
            Password
          </label>
          <div className="pt-form-content">
            <input
              value={this.state.password}
              onChange={this.handlePasswordChange.bind(this)}
              id="input-password"
              className={classnames("pt-input", {
               'pt-intent-danger': false
               })}
              placeholder="password"
              type="password"
              dir="auto" />
          </div>
        </div>
        <div className="login-button">
          <Button rightIconName="arrow-right" className="pt-large"
            text="Login" onClick={() => {}} loading={
              false
            } onClick={() => {}}/>
        </div>
      </div>
    </div>
  }
}

export default LoginView;
