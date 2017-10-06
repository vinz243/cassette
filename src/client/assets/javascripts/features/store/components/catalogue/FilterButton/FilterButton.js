import React, { PropTypes } from 'react'
import { Tooltip,
  Position,
  Popover,
  PopoverInteractionKind,
  Checkbox } from '@blueprintjs/core';
import './FilterButton.scss';
import classnames from 'classnames';

class FilterButton extends React.Component {
  toggleFilter (name) {
    const { store, actions } = this.props;
    if (!store.albumsFilter.includes(name)) {
      actions.addAlbumFilter(name);
    } else {
      actions.removeAlbumFilter(name);
    }
  }
  render () {
    const { store, actions } = this.props;
    return <Popover content={
        <div className="filterPopover">
          <Checkbox checked={
            !store.albumsFilter.includes('Album')
          } label="Albums" onChange={
              this.toggleFilter.bind(this, 'Album')
            }/>
          <Checkbox checked={
            !store.albumsFilter.includes('EP')
          } label="EPs" onChange={
              this.toggleFilter.bind(this, 'EP')
            }/>
          <Checkbox checked={
            !store.albumsFilter.includes('Single')
          } label="Singles" onChange={
              this.toggleFilter.bind(this, 'Single')
            }/>
          <Checkbox checked={
            !store.albumsFilter.includes('Other')
          } label="Other" onChange={
              this.toggleFilter.bind(this, 'Other')
            }/>
        </div>
      } position={Position.BOTTOM} className="filter">
      <span className={classnames('pt-icon-standard',
        'pt-icon-filter-list', {
          filterActive: store.albumsFilter.length
        })}></span>
    </Popover>
  }
}

export default FilterButton;
