import React, { Component, PropTypes } from 'react';
import PlayerControls from './PlayerControls';
import CurrentTrackStatus from './CurrentTrackStatus';
import ToolbarActions from './ToolbarActions';

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
    return (
    	<div>
        <Flex className="mainRow" justify="space-between">
          <Box>
            <PlayerControls {...this.props} />
  	      </Box>
          <Box auto className="currentTrackStatusCol">
           <CurrentTrackStatus {...this.props} />
  	      </Box>
          <Box>
            <ToolbarActions {...this.props}/>
             {/*<BrowserControls  {...this.props} />*/}
  	      </Box>
        </Flex>
      </div>
    );
  }
}
