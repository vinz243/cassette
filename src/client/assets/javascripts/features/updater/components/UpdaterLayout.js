import React, { Component, PropTypes } from 'react';
import './UpdaterApp.scss';

export default class UpdaterLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.fetch();
  }
  handleOK () {
    this.props.actions.prepareUpdate();
    this.props.actions.update();
  }
  handleCancel () {
    if(!this.props.updater.updating) {
      this.props.actions.cancel();
    }
  }
  render() {
    const { updater, actions } = this.props;

    return (
      <div>
        <Modal title="New update available"
          visible={updater.updateAvailable && !updater.errored}
          onOk={this.handleOK.bind(this)}
          confirmLoading={updater.updating}
          okText={updater.updating ? "Updating..." : "Update now"}
          cancelText="Maybe Later"
          onCancel={this.handleCancel.bind(this)}>
          <p>A new update is available! You can choose to update now to
            <b> v{updater.latest} </b>for the latest features and fixes!
            This should take less than a minute and will be entierly automatic,
            it does not need you to open a shell or remote access.</p>
        </Modal>
        <Modal title="Ooops, an error has occured"
          visible={updater.errored}
          onOk={this.handleOK.bind(this)}
          confirmLoading={updater.updating}
          onCancel={this.handleCancel.bind(this)}
          cancelText="Cancel"
          okText={updater.updating ? "Updating..." : "Retry"}>
          <p>Could not update cassette. Check the logs for more details.</p>
        </Modal>
        <div className="currentVersion">
          cassette v{updater.current}
        </div>
      </div>

    );
  }
}
