import React, { PropTypes } from 'react';
import {EditableText, Tooltip} from '@blueprintjs/core';
import classnames from 'classnames';

class TrackerCard extends React.Component {
  constructor () {
    super();
    this.state = {
      host: '',
      type: ''
    }
  }
  componentWillMount () {
    const {tracker, actions} = this.props;
    this.setState({
      name: tracker.name,
      username: tracker.username,
      host: tracker.host,
      status: tracker.status,
      type: tracker.type
    });
  }
  editableEvents(name) {
    return {
      onChange: (value) => {
        this.setState(Object.assign({}, this.state, {
          [name]: value
        }));
      },
      onConfirm: (value) => {
        if (name === 'password') {
          this.setState(Object.assign({}, this.state, {
            password: '',
            realPassword: value
          }));
        }
        return this.props.onChange({[name]: value});

      },
      onEdit: () => {
        if (name === 'password') {
          const el = this.passwordField.valueElement;
          el.previousSibling.type = 'password';
          // el.previousSibling.value = this.state.realPassword;

          // this.setState(Object.assign({}, this.state, {
          //   password: this.state.realPassword
          // }));
        }
      }
    }
  }
  componentWillReceiveProps (nextProps) {
    const {tracker, actions} = this.props;
    this.setState({
      name: tracker.name,
      username: tracker.username,
      host: tracker.host,
      status: tracker.status,
      type: tracker.type
    });
  }
  render () {
    const status = this.props.tracker.status;
    const indicator = <span className={classnames(
        "pt-icon-standard", {
          'pt-icon-tick tick': status === 'CONFIRMED',
          'pt-icon-cross cross': status === 'INVALID',
          'pt-icon-radial updating': status === 'UPDATING',
          'pt-icon-ring radial': status === 'UNCONFIRMED',
        }
      )}></span>;
    return <div className="pt-card pt-elevation-0">
      <h5><EditableText value={this.state.name} {...this.editableEvents('name')}/>
      {this.props.tracker.message ? <Tooltip content={this.props.tracker.message}
        className="status">
        {indicator}
      </Tooltip> : <div className="status">{indicator}</div>}
      </h5>
      <div>
        <span className="pt-icon-standard pt-icon-user"></span>
        <EditableText value={this.state.username} {...this.editableEvents('username')}/>
      </div>
      <div>
        <span className="pt-icon-standard pt-icon-lock"></span>
        <EditableText value={this.state.password}
          {...this.editableEvents('password')}
          placeholder='Edit password'
          ref={(ref) => this.passwordField = ref}/>
      </div>
      <div>
        <div className="pt-control-group">
          <div className="pt-select">
            <select onChange={
              (e) => {
                this.setState({
                  ...this.state,
                  type: e.target.value
                });
                this.props.onChange({type: e.target.value});
              }
            } value={this.state.type}>
              <option value="">Type...</option>
              <option value="gazelle">Gazelle</option>
              <option value="t411">t411</option>
            </select>
          </div>
          <div className="pt-input-group">
            <input type="text" className="pt-input" value={this.state.host}
              onChange={
                (e) => {
                  this.setState({
                    ...this.state,
                    host: e.target.value
                  });
                }
              } placeholder="mytracker.io" onKeyPress={
                (e) => {
                  if (e.charCode === 13) {
                    this.props.onChange({host: this.state.host});
                  }
                }
              }/>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default TrackerCard;
