import React, { Component, PropTypes } from 'react';
import './SidebarApp.scss';
import {Row, Col, Tooltip, Input} from 'antd';
import 'antd/dist/antd.css';
import SidebarLibraryItem from './SidebarLibraryItem';
import IonPlusRound from 'react-icons/lib/io/plus-round';
import {Link} from 'react-router';

export default class SidebarLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {
      newLibraryName: '',
      newLibraryPath: ''
    };
  }
  librarySubmit(e) {
    const { sidebar, actions } = this.props;
    actions.addLibrary(this.state.newLibraryName, this.state.newLibraryPath);
  }
  libraryNameChange(e) {
    this.setState({
      newLibraryName: e.target.value,
      newLibraryPath: this.state.newLibraryPath
        // ...this.state
    });
  }
  libraryPathChange(e) {
    this.setState({
      newLibraryPath: e.target.value,
      newLibraryName: this.state.newLibraryName
    });
  }
  componentDidMount() {
    this.props.actions.loadContent();
  }
  render() {
    const { sidebar, actions } = this.props;
    const boundLibrarySubmit = this.librarySubmit.bind(this);
    const boundLibraryNameChange = this.libraryNameChange.bind(this);
    const boundLibraryPathChange = this.libraryPathChange.bind(this);

    let items = (sidebar.libraries || []).map(lib =>
      <SidebarLibraryItem key={lib._id}
        libraryName={lib.name}
        libraryId={lib._id}
        actions={actions} />);

    return (
    	<div className="sidebar">
        <div className="parentItem">
          <Row gutter={24}>
            <Col span={21}>
              <Link to="/app/library" className="librariesLink">Libraries</Link>
            </Col>
            <Col span={2}>
              <Tooltip
                trigger="click" title={
                  <Row gutter={4}>
                    <Col span={8}>
                      <Input placeholder="Name" className="newLibraryName"
                        onChange={boundLibraryNameChange} />
                    </Col>
                    <Col span={16}>
                      <Input placeholder="Path" className="newLibraryPath"
                        onChange={boundLibraryPathChange}
                        onPressEnter={boundLibrarySubmit}></Input>
                    </Col>
                  </Row>
                }><IonPlusRound className="addButton"/></Tooltip>
            </Col>
          </Row>
        </div>
        {items}
        <div className="storeLinkParent">
          <Link to="/app/store" className="storeLink">Store</Link>
        </div>
      </div>
    );
  }
}
