import React, { Component, PropTypes } from 'react';
import './ListView.scss';
import ListItem from '../ListItem';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css';


export default class ListView extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { library, actions } = this.props;
    let list = [];
    for (let item of library.items) {
      list.push(
        <ListItem track={item.track} key={item.id} select={actions.select}/>
      );
    }
    return (
    	<div>
        {list}
      </div>
    );
  }
}
