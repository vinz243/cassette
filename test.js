// 52461
const fs = require('fs');
const JobTorrent = require('./lib/server/features/jobs/JobTorrent').default;
let infoHash = '9589F6F719290577D0BA5472CFBE7DFC054EFF1B';

let job = new JobTorrent({infoHash});

job.getProgress().then(console.log);
