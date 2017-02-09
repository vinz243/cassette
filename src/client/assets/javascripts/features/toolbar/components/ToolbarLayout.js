import React, { Component, PropTypes } from 'react';
import PlayerControls from './PlayerControls';
import CurrentTrackStatus from './CurrentTrackStatus';
import BrowserControls from './BrowserControls';
import './ToolbarApp.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';

export default class ToolbarLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { toolbar, actions } = this.props;
    return (
    	<div>
        <Row className="mainRow">
          <Col span={1}></Col>
          <Col span={7}>
            <PlayerControls {...this.props} />
  	      </Col>
          <Col span={7} className="currentTrackStatusCol">
           <CurrentTrackStatus {...this.props} />
  	      </Col>
          <Col span={7}>
             {/*<BrowserControls  {...this.props} />*/}
  	      </Col>
          <Col span={2}></Col>
        </Row>
      </div>
    );
  }
}
