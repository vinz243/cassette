import React, { PropTypes } from 'react'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as settingsActions, selector } from '../';
import { Tab2, Tabs2 } from "@blueprintjs/core";

import PlaybackView from './playback/PlaybackView';
import LibrariesView from './libraries/LibrariesView';
import TrackersView from './trackers/TrackersView';

@connect(selector, (dispatch) => {
  let res = {
    actions: bindActionCreators(settingsActions, dispatch)
  };

  return res;
})
class SettingsView extends React.Component {
  render () {
    return <div className="settingsContainer" style={{
        margin: '3em 2em'
      }}>
      <Tabs2 id="settings" onChange={this.handleTabChange}>
        <Tab2 id="li" title="Libraries" panel={<LibrariesView {...this.props}/>} />
        <Tab2 id="tk" title="Trackers" panel={<TrackersView {...this.props}/>} />
      </Tabs2>
    </div>
  }
}

export default SettingsView;
