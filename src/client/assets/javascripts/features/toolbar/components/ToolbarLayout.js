import React, { Component, PropTypes } from 'react';
import PlayerControls from './PlayerControls';
import CurrentTrackStatus from './CurrentTrackStatus';
import BrowserControls from './BrowserControls';
import './ToolbarApp.scss';
import {Box, Flex} from 'reflexbox';
import 'antd/dist/antd.css';

export default class ToolbarLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { toolbar, actions } = this.props;
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
