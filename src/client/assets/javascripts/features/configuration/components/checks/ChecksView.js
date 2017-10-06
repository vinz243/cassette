import React, { PropTypes } from 'react'
import classnames from 'classnames';
import './ChecksView.scss';
import socket from 'app/socket';

class ChecksView extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.actions.updateChecks();
      socket.listen('checks::socketiotest::ping', (key) => {
        socket.emit('checks::socketiotest::pong', key);
      });

    }, 250);
  }
  render () {
    const {actions, configuration} = this.props;
    const checks = Object.keys(configuration.checksById).map((id) => {
      const check = configuration.checksById[id];

      return <div className={classnames("configuration-check", {
          'check-ok': check.status === 'ok',
          'check-ko': check.status === 'ko',
          'check-uk': check.status === 'uk',
        })} key={id}>
        <span className={classnames("pt-icon-standard", {
            'pt-icon-small-tick': check.status === 'ok',
            'pt-icon-cross': check.status === 'ko',
            'pt-icon-dot': check.status === 'uk'
          })}></span> <span className="check-text">{check.message}</span>
      </div>
    });
    return <div className="configuration-checks-view">
      {checks}
    </div>
  }
}

export default ChecksView;
