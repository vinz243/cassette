import React, { PropTypes } from 'react'
import {Button, Intent} from '@blueprintjs/core';
import './LibrariesView.scss';
import FileBreadcrumb from 'components/FileBreadcrumb';
import {once} from 'lodash-decorators';

class LibrariesView extends React.Component {
  constructor () {
    super();
    this.state = {
      name: ''
    }

  }
  @once
  loadLibraries() {
    this.props.actions.loadLibs();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.loadLibraries();
    }
  }
  handleNameChange (evt) {
    this.setState({
      name: evt.target.value
    });
  }
  render () {
    const {configuration, actions} = this.props;
    const libraries = configuration.libraries.map(lib => {
      return <div className="library-item">
        <span className="library-name">{lib.name}</span>
        <span className="library-path">{lib.path}</span>
      </div>
    });
    return <div className="configuration-libraries-view">
      {libraries}
      <div className="add-library">
        <div className="add-lib-header">
          Add custom libraries
        </div>
        <div className="add-lib-path">
          <FileBreadcrumb currentPath={configuration.currentPath}
            fs={configuration.fs} onLoad={actions.loadPath}
            onChange={actions.setCurrentPath}/>
        </div>
        <div className="second-row">
          <div className="add-lib-name">
            <input className="pt-input input-name pt-minimal" placeholder="Name"
              value={this.state.name} onChange={this.handleNameChange.bind(this)}/>
          </div>
          <div className="add-lib-button">
            <Button iconName="add" text="add" className="pt-minimal"
                onClick={() => actions.addLibrary(this.state.name,
                  `/${configuration.currentPath.slice(0,
                    configuration.currentPath.length - 1).join('/')}`
                )}/>
          </div>
        </div>
      </div>
    </div>
  }
}

export default LibrariesView;
