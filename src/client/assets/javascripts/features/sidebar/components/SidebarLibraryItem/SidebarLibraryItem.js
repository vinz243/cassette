import React, { Component, PropTypes } from 'react';
import './SidebarLibraryItem.scss';
import IonRefresh from 'react-icons/lib/io/refresh';
import IonMinusRound from 'react-icons/lib/io/minus-round';

export default class SidebarLibraryItem extends Component {
  static propTypes = {
  };
  handleScan(e) {
    notification.success({
      message: 'Library scan started',
      description: 'The library is being scanned. You don\'t need to refresh the page or anything',
    });
    this.props.actions.scanLibrary(this.props.libraryId);
  }
  render() {

    const boundHandleScan = this.handleScan.bind(this);
    // const { library, actions, track } = this.props;
    return (
    	<div className="sidebarLibraryItem">
        <Row gutter={24}>
          <Col span={1}></Col>
          <Col span={16}>
            {this.props.libraryName}
          </Col>
          <Col span={2}>
            <IonRefresh className="libraryAction" onClick={boundHandleScan}/>
          </Col>
          <Col span={2}>
          { /* <IonMinusRound className="libraryAction" />*/}
          </Col>
        </Row>

      </div>
    );
  }
}
