import test from 'ava';
import JobTorrent from './JobTorrent';


test('constructor - should accept a valid hash', t => {
  t.is(new JobTorrent({
    infoHash: '9589f6f71e210577d0ba5472cfbe7dfc054eff1b'
  }).props.infoHash, '9589f6f71e210577d0ba5472cfbe7dfc054eff1b');
  t.is(new JobTorrent({
    infoHash: '9589F6F71E210577D0BA5472CFBE7DFC054EFF1B'
  }).props.infoHash, '9589F6F71E210577D0BA5472CFBE7DFC054EFF1B');
});

test('constructor - shouldn\'t accept an invalid hash',  t => {
  t.throws(() => {
    new JobTorrent({infoHash: ''});
  });
  t.throws(() => {
    new JobTorrent({infoHash: 'aa'});
  });
  t.throws(() => {
    new JobTorrent({infoHash: 'ZZ89F6Z71E210577D0BA5472CFBE7DFC054EFF1B'});
  });
  t.throws(() => {
    new JobTorrent({infoHash: 'f6f71e210577d0ba5472cfbe7dfc054eff1b'});
  });
  t.throws(() => {
    new JobTorrent({infoHash: 42});
  });
  t.throws(() => {
    new JobTorrent({infoHash: '9589f6f7  210577d0ba5472cfbe7dfc054eff1b'});
  });
})

test('getProgress - should return a valid progress', async t => {
  const hash = '9589f6f71e210577d0ba5472cfbe7dfc054eff1b';
  let scgi = (method, params, host, port) => {
    t.deepEqual(params, [hash]);
    t.is(host, '151.101.65.140');
    t.is(port, 1337);
    switch (method) {
      case 'd.get_complete':
        return Promise.resolve(0);
      case 'd.get_bytes_done':
        return Promise.resolve(56154);
      case 'd.get_size_bytes':
        return Promise.resolve('1337');
      default:
        throw new Error('Called with ', method)
    }
  }
  let job = new JobTorrent({
    infoHash: hash,
    scgiHost: '151.101.65.140',
    scgiPort: 1337,
    scgi
  });
  let progress = await job.getProgress();
  t.is(progress, 42);
});

test('getProgress - should return 1 when finished', async t => {
  const hash = '9589f6f71e210577d0ba5472cfbe7dfc054eff1b';
  let scgi = (method, params, host, port) => {
    t.deepEqual(params, [hash]);
    t.is(host, '151.101.65.140');
    t.is(port, 1337);
    switch (method) {
      case 'd.get_complete':
        return Promise.resolve(1);
      case 'd.get_bytes_done':
        return Promise.resolve(56154);
      case 'd.get_size_bytes':
        return Promise.resolve('1337');
      default:
        throw new Error('Called with ', method)
    }
  }
  let job = new JobTorrent({
    infoHash: hash,
    scgiHost: '151.101.65.140',
    scgiPort: 1337,
    scgi
  });
  let progress = await job.getProgress();
  t.is(progress, 1);
});
test('getData - should return 1 when finished', async t => {
  const hash = '9589f6f71e210577d0ba5472cfbe7dfc054eff1b';
  let scgi = (method, params, host, port) => {
    t.deepEqual(params, [hash]);
    t.is(host, '151.101.65.140');
    t.is(port, 1337);
    switch (method) {
      case 'd.get_complete':
        return Promise.resolve(0);
      case 'd.get_bytes_done':
        return Promise.resolve(56154);
      case 'd.get_size_bytes':
        return Promise.resolve('1337');
      default:
        throw new Error('Called with ', method)
    }
  }
  let job = new JobTorrent({
    infoHash: hash,
    scgiHost: '151.101.65.140',
    scgiPort: 1337,
    scgi
  });
  job.props.name = 'Foobar';
  let data = await job.getData();
  t.deepEqual(data, {
    _id: data._id,
    name: 'Foobar',
    progress: 42,
    type: 'download'
  });
});

test('fromTorrent - should support dependency injection', t => {
  t.is(JobTorrent.fromTorrent('foo', () => {
    return {infoHash: '1337f6f71e210577d0ba5472cfbe7dfc054eff42'};
  }).props.infoHash, '1337f6f71e210577d0ba5472cfbe7dfc054eff42');
});

test('fromTorrent - dependency injection should be optional', t => {
  t.is(JobTorrent.fromTorrent('1337f6f71e210577d0ba5472cfbe7dfc054eff42')
    .props.infoHash, '1337f6f71e210577d0ba5472cfbe7dfc054eff42');
});

test('push - works without error', t => {
  let arr = []
  JobTorrent.push({foo: 'bar'}, arr);
  t.deepEqual(arr, [{foo: 'bar'}]);
});

test('find - find all when nothing specified', t => {
  let arr = [{
    foo: 'bar'
  }, {
    bar: 'foo',
    foo: {
      value: 42
    }
  }, {a: 'b'}];
  t.deepEqual(arr, JobTorrent.find({}, arr));
});

test('find - find by _id', t => {
  let arr = [{
    _id: '1337',
    type: 'download'
  },{
    _id: '42',
    type: 'download'
  },{
    _id: '34',
    type: 'upload'
  }].map(el => ({props: el}));
  t.deepEqual(JobTorrent.find({_id: '1337'}, arr), [{props: {
    _id: '1337',
    type: 'download'
  }}]);
});

test('findById - returns a single document', t => {
  let arr = [{
    _id: '1337',
    type: 'download'
  },{
    _id: '42',
    type: 'download'
  },{
    _id: '34',
    type: 'upload'
  }].map(el => ({props: el}));
  t.deepEqual(JobTorrent.findById('1337', arr), {props: {
    _id: '1337',
    type: 'download'
  }});
});

test('findById - returns undefined if not found', t => {
  let arr = [{
    _id: '1337',
    type: 'download'
  }].map(el => ({props: el}));
  t.is(JobTorrent.findById('42', arr), undefined);
});

test('find - find by type', t => {
  let arr = [{
    _id: '1337',
    type: 'download'
  },{
    _id: '42',
    type: 'download'
  },{
    _id: '34',
    type: 'upload'
  }].map(el => ({props: el}));
  t.deepEqual(JobTorrent.find({type: 'download'}, arr), [{props: {
    _id: '1337',
    type: 'download'
  }}, {props: {
    _id: '42',
    type: 'download'
  }}]);
});
test('find - find by _id and type', t => {
  let arr = [{
    _id: '1337',
    type: 'download'
  },{
    _id: '42',
    type: 'download'
  },{
    _id: '42',
    type: 'upload'
  }].map(el => ({props: el}));
  t.deepEqual(JobTorrent.find({_id: '42', type: 'upload'}, arr), [{props: {
    _id: '42',
    type: 'upload'
  }}]);
});
