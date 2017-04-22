import React, { PropTypes } from 'react'
import {Button, Intent} from '@blueprintjs/core';
import './LoginView.scss';
import classnames from 'classnames';
import axios from 'app/axios';
import Toaster from 'app/toaster';

class LoginView extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
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
  login(evt) {
    evt.preventDefault();
    axios.login({...this.state}).then(() => {
      this.context.router.push('/app/library');
    }).catch((err) => {
      Toaster.show({
        iconName: 'warning',
        intent: Intent.DANGER,
        message: 'Wrong username or password'
      })
    });
  }
  render () {
    return <div className="login-content">
      <div className="login-header">
        <h3>Welcome back on cassette!</h3>
      </div>
      <div className="login-content">
        <form onSubmit={(evt) => this.login(evt)}>
          <div className={classnames("pt-form-group", {
              'pt-intent-danger': false
            })}>
            <label className="pt-label" htmlFor="input-username">
              Username
            </label>
            <div className="pt-form-content">
              <input
                autoFocus={true}
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
            <label className="pt-label" htmlFor="input-password">
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
              text="Login" type="submit" loading={
                false
              }/>
            </div>
        </form>
      </div>
    </div>
  }
}

export default LoginView;
