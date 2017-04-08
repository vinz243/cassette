import React, { PropTypes } from 'react';

class LibrariesView extends React.Component {
  render () {
    return <div className="settings libraries">
      <table className="pt-table pt-interactive">
        <thead>
          <th>Name</th>
          <th>Path</th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr>
            <td>Downloads</td>
            <td>/home/vinz243/.cassette/downloads</td>
            <td>
              <button type="button" className="pt-button pt-minimal pt-icon-trash">
              </button>
              <button type="button" className="pt-button pt-minimal pt-icon-refresh">
              </button>
            </td>
          </tr>
          <tr>
            <td>Plex</td>
            <td>/home/vinz243/plex/Music</td>
            <td>
              <button type="button" className="pt-button pt-minimal pt-icon-trash">
              </button>
              <button type="button" className="pt-button pt-minimal pt-icon-refresh">
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  }
}

export default LibrariesView;
