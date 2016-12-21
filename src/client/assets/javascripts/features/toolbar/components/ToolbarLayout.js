import React, { Component, PropTypes } from 'react';
import PlayerControls from './PlayerControls';
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
          <Col xs={24} span={8}>
            <PlayerControls  {...this.props} />
    	     </Col>
          </Row>
      </div>
    );
  }
}
