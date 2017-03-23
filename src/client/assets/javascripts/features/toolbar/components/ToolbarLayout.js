import React, { Component, PropTypes } from 'react';
import PlayerControls from './PlayerControls';
import CurrentTrackStatus from './CurrentTrackStatus';

import './ToolbarApp.scss';

import {Box, Flex} from 'reflexbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { actionCreators as playlistActions,
  selector as playlistSelector } from 'features/playlist';
import { actionCreators as toolbarActions,
  selector as toolbarSelector } from 'features/toolbar';

@connect(createStructuredSelector({
  toolbar: (state) => state['toolbar'],
  playlist: (state) => state['playlist']
}), (dispatch) => ({
    actions: bindActionCreators(
      Object.assign({}, toolbarActions, playlistActions),
      dispatch)
}))
export default class ToolbarLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { toolbar, actions } = this.props;
    console.log(this.props);
    return (
    	<div>
        <Flex className="mainRow" align="center" justify="space-between">
          <Box>
            <PlayerControls {...this.props} />
  	      </Box>
          <Box auto className="currentTrackStatusCol">
           <CurrentTrackStatus {...this.props} />
  	      </Box>
          <Box>
             {/*<BrowserControls  {...this.props} />*/}
  	      </Box>
        </Flex>
      </div>
    );
  }
}
