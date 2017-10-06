import React, { PropTypes } from 'react'
import './WantedRow.scss'
import WantedItem from '../WantedItem';
import WantedCollapsible from '../WantedCollapsible';

class WantedRow extends React.Component {
  select (id) {
    this.props.onSelect(id);
  }
  render () {
    const items = this.props.items.map((el) =>
      <WantedItem item={el}  onSelect={this.select.bind(this)} key={el._id}/>
    );

    return <div className="wanted-row">
      {items}
      <WantedCollapsible item={this.props.current} isOpen={
          this.props.current &&
            !!this.props.items.find(el => el._id === this.props.current._id)
        } onClose={this.props.onClose}
        onSearch={this.props.onSearch}
        onPick={this.props.onPick} />
    </div>
  }
}

export default WantedRow;
