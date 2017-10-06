import React, { PropTypes } from 'react';
import classnames from 'classnames';
import {Button} from '@blueprintjs/core';

class LibrariesView extends React.Component {
  constructor () {
    super();
    this.state = {
      name: '',
      path: ''
    };
  }
  handleChange (name) {
    return (event) => {
      this.setState({[name]: event.target.value});
    }
  }
  componentDidMount() {
    this.props.actions.loadLibraries();
  }
  render () {
    const {settings, actions} = this.props;
    const libraries = settings.libraries.map((lib) =>
      <tr>
        <td>{lib.name}</td>
        <td>{lib.path}</td>
        <td>
          <button type="button" className="pt-button pt-minimal pt-icon-trash pt-disabled">
          </button>
          <button type="button" className="pt-button pt-minimal pt-icon-refresh">
          </button>
        </td>
      </tr>)
    return <div className="settings libraries">
      <table className="pt-table pt-interactive">
        <thead>
          <th>Name</th>
          <th>Path</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {libraries}
          <tr>
            <td><input className={classnames('pt-input', {
                'pt-disabled': settings.addingLib
              })} placeholder="Library name"
              onChange={this.handleChange('name')} value={this.state.name} />
          </td><td>
          <input className={classnames('pt-input', {
              'pt-disabled': settings.addingLib
            })} placeholder="Library path"
              onChange={this.handleChange('path')} value={this.state.path} />
          </td><td>
              <Button type="button"
                onClick={() => actions.addLibrary(this.state.name,
                  this.state.path)}
                loading={settings.addingLib}
                className="pt-button pt-intent-primary pt-icon-add"
                text="Add" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  }
}

export default LibrariesView;
