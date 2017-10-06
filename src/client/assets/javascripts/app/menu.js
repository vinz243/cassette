import React from 'react';

import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";

export default function (items) {
  const content = items.map((item) =>
    <MenuItem text={<div className="context-menu-item">
      {item.text} <span>{item.shortcut}</span>
  </div>} iconName={item.icon} onClick={() => item.action()}/>
  )
  return <Menu>
    {content}
  </Menu>
}
