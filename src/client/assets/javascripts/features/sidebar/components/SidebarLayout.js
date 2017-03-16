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
  itemSelected(re) {
    return re.test(this.props.location.pathname) ? 'selected' : '';
  }
  render() {
    console.log(this);
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
        <div className={this.itemSelected(/artists$/)} onClick={
            () => this.props.history.push('/app/library/artists')
          }>
          <span className="pt-icon-standard pt-icon-user">
          </span>
          <span className="itemName">
            Artists
          </span>
        </div>
        <div className={this.itemSelected(/albums$/)} onClick={
            () => this.props.history.push('/app/library/albums')
          }>
          <span className="pt-icon-standard pt-icon-unresolve">
          </span>
          <span className="itemName">
            Albums
          </span>
        </div>
          <div className={this.itemSelected(/tracks$/)} onClick={
              () => this.props.history.push('/app/library/tracks')
            }>
          <span className="pt-icon-standard pt-icon-property">
          </span>
          <span className="itemName">
            Tracks
          </span>
        </div>
        <div className="divider"></div>
        <div className="">
          <span className="pt-icon-standard pt-icon-shop">
          </span>
          <span className="itemName">
            Store
          </span>
        </div>
        <div className="">
          <span className="pt-icon-standard pt-icon-settings">
          </span>
          <span className="itemName">
            Settings
          </span>
        </div>
        <div className="bottom">
          <span className="pt-icon-standard pt-icon-refresh">
          </span>
          <span className="itemName">
            Refresh Libraries
          </span>
        </div>
      </div>
    );
  }
}
