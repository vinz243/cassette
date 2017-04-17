import React, { PropTypes } from 'react'
import {Button, Intent} from '@blueprintjs/core';
import './LibrariesView.scss';

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
      <div className="add-library pt-control-group">
        <input className="pt-input input-name" placeholder="Name" />
        <input className="pt-input input-path" placeholder="Folder Path" />
        <Button iconName="add" />
      </div>
    </div>
  }
}

export default LibrariesView;
