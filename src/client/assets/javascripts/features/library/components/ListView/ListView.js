import React, { Component, PropTypes } from 'react';
import './ListView.scss';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';

export default class ListView extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { library, actions } = this.props;
    console.log(library);
    return (
    	<div>
        Hello
      </div>
    );
  }
}
