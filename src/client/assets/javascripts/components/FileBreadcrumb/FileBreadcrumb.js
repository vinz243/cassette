import React, { PropTypes } from 'react';
import ScrollableDiv from 'components/ScrollableDiv';

import path from 'path';
import {
    Classes,
    CollapseFrom,
    CollapsibleList,
    MenuItem,
    Popover,
    Menu,
    Position
} from "@blueprintjs/core";
import classnames from 'classnames';

class FileBreadcrumb extends React.Component {
  static propTypes = {
    currentPath: PropTypes.arrayOf(PropTypes.string),
    fs: PropTypes.any.isRequired,
    onLoad: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    visibleItems: PropTypes.number,
  }
  render () {
    const {currentPath = [], fs, onLoad, onChange, visibleItems = 4} = this.props;
    const folders = currentPath.reduce((acc, el) => {
      return [
        ...acc,
        [...acc[acc.length - 1], el]
      ]
    }, [[]]).slice(1);
    const items = folders.map((tree) =>
      <MenuItem iconName="folder-close" text={tree[tree.length - 1]}
        key={tree.join('/')} path={`/${tree.join('/')}`}
        onClick={() => this.props.onChange(`/${tree.join('/')}`)}/>
    )
    return <CollapsibleList
      className={Classes.BREADCRUMBS}
      dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
      renderVisibleItem={this.renderVisibleItem.bind(this)}>
        {items}
      </CollapsibleList>
  }
  renderVisibleItem (props) {
    if (props.key != null) {
        return <a className={Classes.BREADCRUMB}>{props.text}</a>;
    } else {
      const dir = path.join(props.path, props.text === '.' ? '.' : '..');
      const items = (this.props.fs[dir] || []).map((folder) => {
        return <MenuItem iconName="folder-close" text={folder} onClick={
            () => this.props.onChange(path.join(dir, folder))
          }/>
      })
      return <span className={classnames(Classes.BREADCRUMB,
          Classes.BREADCRUMB_CURRENT)} style={{
            cursor: 'pointer'
          }}>
          <Popover
            popoverWillOpen={() => this.props.onLoad(dir)}
            content={<Menu>{items}</Menu>}
            position={Position.BOTTOM}>{props.text}</Popover>
      </span>;
    }
  }
}

export default FileBreadcrumb;
