import React, { Component, PropTypes } from 'react';
import ListView from './ListView';
import './LibraryApp.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';

export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { toolbar, actions } = this.props;
    return (
    	<div>
        <ListView {...this.props}/>
      </div>
    );
  }
}
