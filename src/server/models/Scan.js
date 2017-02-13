import child_process from 'child_process';
import chalk from 'chalk';
import {findById as findLibraryById} from './Library';

import {
  mainStory
} from 'storyboard';

// track.data.trackNumber = (t.trackNumber + '').match(/^\d+/)[0] - 0;
export const processResult = async(res) => {
  if (res.status === 'done') {

  }
}
export const libraryScanner = (state) => ({
  runScan: () => {
    state.props.statusCode = 'STARTED';
    state.props.statusMessage = 'Scan started...';
    let story = mainStory.child({
      src: 'libscan',
      title: 'Library scan',
      level: 'info'
    });
    story.debug('Running scan on `nextTick()`');
    process.nextTick(() => {
      if (state.props.dryRun) {
        state.props.statusCode = 'DONE';
        state.props.statusMessage = 'Scan was a dry run';
        state.functions.update();
        story.warn(`${chalk.bold('dryRun')} flag was set`);
        story.close();
      } else {
        findLibraryById(state.props.library).then((dir) => {
          let child = child_process.fork(require.resolve('../scripts/music_scanner'));
          story.debug('Child process forked');

          story.debug(`${chalk.dim('Executing action ')} 'set_config'`, {attach: {
            dir: dir.data.path
          }});

          child.send({
            action: 'set_config',
            data: {
              dir: dir.data.path
            }
          });

          story.debug(`${chalk.dim('Executing action ')} 'execute'`);
          child.send({
            action: 'execute'
          });

          child.on('message', (res) => {
            if (res.status === 'LOG') {
              story.info(res.msg);
              return;
            }
            processResult(res).then(() => {
              state.props.statusCode = 'DONE';
              state.props.statusMessage = 'Scan finished without errors';
              state.functions.update();
              story.info('Scan finished !');
              story.close();
            }).catch((err) => {
              state.props.statusCode = 'FAILED';
              state.props.statusMessage = err;
              state.functions.update();
              story.error('Scan errored', err);
              story.close();
            });
          });
        });
      }
    });
  }
});


export const Scan = function(props) {
  if (typeof props === 'string') {
    props = {
      name: props
    };
  }
  let state = {
    name: 'scan',
    fields: ['statusCode', 'statusMessage'],
    functions: {},
    populated: {},
    props
  };
  return assignFunctions(
    state.functions,
    defaultFunctions(state),
    updateable(state),
    createable(state),
    databaseLoader(state),
    publicProps(state),
    legacySupport(state)
  );
}

export const findOne = findOneFactory(Scan);

export const findById = (_id) => findOne({
  _id
});

export const find = findFactory(Scan, 'scan');
