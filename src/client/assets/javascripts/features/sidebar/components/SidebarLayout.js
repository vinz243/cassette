import React, { Component, PropTypes } from 'react';
import './SidebarApp.scss';

import classnames from 'classnames';
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
  refreshLibraries () {
    const { sidebar, actions } = this.props;
    actions.scanLibraries();
  }
  itemSelected(re) {
    return re.test(this.props.location.pathname) ? 'selected' : '';
  }
  componentWillReceiveProps(props) {
    const { sidebar, actions } = this.props;
    if (props.sidebar.scanId && props.sidebar.scanId !== sidebar.scanId) {
      actions.waitScan(props.sidebar.scanId);
    }
  }
  render() {
    const { sidebar, actions } = this.props;


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
        <div className={this.itemSelected(/^\/app\/store/)} onClick={
            () => this.props.history.push('/app/store')
          }>
          <span className="pt-icon-standard pt-icon-shop">
          </span>
          <span className="itemName">
            Store
          </span>
        </div>
        <div className={this.itemSelected(/^\/app\/settings$/)} onClick={
            () => this.props.history.push('/app/settings')
          }>
          <span className="pt-icon-standard pt-icon-settings">
          </span>
          <span className="itemName">
            Settings
          </span>
        </div>
        <div className={classnames("bottom", {
            working: sidebar.scanning
          })} onClick={
            this.refreshLibraries.bind(this)
          }>
          <span className={classnames("pt-icon-standard pt-icon-refresh", {
              working: sidebar.scanning
            })}>
          </span>
          <span className="itemName">
            Refresh Libraries
          </span>
        </div>
      </div>
    );
  }
}
