import React, { PropTypes } from 'react'
import classnames from 'classnames';

const NonIdealState = React.createClass({
  render () {
    return (
      <div className={classnames("pt-non-ideal-state", this.props.className)}>
        <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
          <span className={`pt-icon pt-icon-${this.props.icon}`}></span>
        </div>
        <h4 className="pt-non-ideal-state-title">{this.props.title}</h4>
        <div className="pt-non-ideal-state-description">
          {this.props.description}
        </div>
      </div>
    )
  }
})

export default NonIdealState;
