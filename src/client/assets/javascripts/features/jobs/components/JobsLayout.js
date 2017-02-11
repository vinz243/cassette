import React, { Component, PropTypes } from 'react';
import './JobsApp.scss';
import {Row, Col, Card, Progress} from 'antd';
import 'antd/dist/antd.css';

export default class JobsLayout extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    setInterval(() => {
      this.props.actions.update();
    }, 6000);
  }
  render() {
    const { jobs, actions } = this.props;
    let content = jobs.jobs.map((job) => (
      <Card className="card" bodyStyle={{ padding: '1.2em' }} key={job._id}>
        <div className="progress">
          <Progress percent={Math.round(job.progress * 100)}
            strokeWidth={5}
            status="active"
            showInfo={false}/>
        </div>
        <div className="name">
          {job.name}
        </div>
      </Card>
    ));
    return (
    	<div className="jobsListContainer">
        <div className="jobsList">
          {content}
        </div>
      </div>
    );
  }
}
