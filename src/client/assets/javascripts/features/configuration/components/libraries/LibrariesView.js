import React, { PropTypes } from 'react'
import {Button, Intent} from '@blueprintjs/core';
import './LibrariesView.scss';
import FileBreadcrumb from 'components/FileBreadcrumb';

class LibrariesView extends React.Component {
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
        <div className="add-lib-name">
          <input className="pt-input input-name pt-minimal" placeholder="Name" />
        </div>
        <div className="add-lib-button">
          <Button iconName="add" text="add" className="pt-minimal" />
        </div>
      </div>
    </div>
  }
}

export default LibrariesView;
