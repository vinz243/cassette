import shortid from 'shortid';


class Job {
  constructor(name, job) {
    this.name = name;
    this.id = shortid();
    this.progress = 0;
    this.status = {
      pending: true,
      string: 'pending'
    };
    this._job = job;
  }
  run() {
    this._job((pct) => {
      this.progress = pct;
    }).then((res) => {
      this.status = {
        done: true,
        fulfilled: true,
        string: 'success'
      };

      this.progress = 1;
      this.result = res;
    }).catch((err) => {
      this.status = {
        done: true,
        rejected: true,
        string: 'failed'
      };

      this.progress = -1;
      this.result = err;
    });
    return this;
  }
}

let jobs = {};

const Controller = {
  add: (name, func) => {
    let job = new Job(name, func);
    jobs[job.id] = job;
    job.run();
  },

  getStatus: (id) => {

    let job = jobs[id];
    if(!job) {
      return {
        success: false,
        status: 404,
        data: {
          error_code: 'EJOBNOTFOUND',
          error_message: `Job id #{id} was not found.`
        }
      }
    }
    return {
      status: 'success',
      code: 200,
      data: {
        job_status: job.status.string,
        job_progress: job.progress,
        job_id: job.id,
        job_name: job.name
      }
    };
  }
}

export {Job, Controller};
