import React, { PropTypes } from 'react'
import './LoginView.scss';

class LoginView extends React.Component {
  render () {
    return <div className="configuration-login-view">
      <div className="pt-form-group">
        <label className="pt-label" for="input-username">
          Username
          <span className="pt-text-muted">(required)</span>
        </label>
        <div className="pt-form-content">
          <input id="input-username" className="pt-input" placeholder="username" type="text" dir="auto" />
          <div className="pt-form-helper-text">Avoid things like admin, root...</div>
        </div>
      </div>
      <div className="pt-form-group">
        <label className="pt-label" for="input-password">
          Password
          <span className="pt-text-muted">(required)</span>
        </label>
        <div className="pt-form-content">
          <input id="input-password" className="pt-input" placeholder="password" type="password" dir="auto" />
          <div className="pt-form-helper-text">Choose a long secure password</div>
        </div>
      </div>
      <div className="pt-form-group">
        <label className="pt-label" for="input-password-confirmation">
          Password Confirmation
          <span className="pt-text-muted">(required)</span>
        </label>
        <div className="pt-form-content">
          <input id="input-password-confirmation" className="pt-input" placeholder="password" type="password" dir="auto" />
        </div>
      </div>
    </div>
  }
}

export default LoginView;
