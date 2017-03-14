import React, { Component, PropTypes } from 'react';
import './SidebarApp.scss';
import {Row, Col, Tooltip, Input, Menu, Icon} from 'antd';
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
    	<div>
        <Menu mode="vertical" theme="dark" className="sidebar">
          <Menu.Item key="artists">
              <Icon className="menuItem" type="user" />
          </Menu.Item>
          <Menu.Item key="albums">
            <Icon className="menuItem" type="switcher" />
          </Menu.Item>
          <Menu.Item key="tracks">
            <Icon className="menuItem" type="bars" />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
