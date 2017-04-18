import React, { Component, PropTypes } from 'react';
import './ListView.scss';
import ListItem from '../ListItem';


export default class ListView extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { library, actions } = this.props;
    let list = library.items.map((item) => {
        return <ListItem track={item} key={item.id} select={actions.playTracks}/>
    });
    return (
    	<div>
        {list}
      </div>
    );
  }
}
