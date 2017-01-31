import React, { Component, PropTypes } from 'react';
import ListView from './ListView';
import './LibraryApp.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';

export default class LibraryLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };
  componentDidMount() {
    const { library, actions } = this.props;
    actions.loadContent();

  }
  render() {
    const { library, actions } = this.props;
    let content;
    if (library.loading) {
      content = <span>Loading...</span>
    } else {
      content = <ListView {...this.props}/>
    }
    return (
    	<div className="libraryContainer">
        {content}
      </div>
    );
  }
}
