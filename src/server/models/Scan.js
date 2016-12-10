import Model from './Model';
import process from 'process';

let Scan = new Model('scan')
  .field('startDate')
    .int()
    .done()
  .field('dryRun')
    .defaultValue(false)
    .boolean()
    .done()
  .field('libraryId')
    .string()
    .required()
    .defaultParam()
    .done()
  .field('statusMessage')
    .string()
    .done()
  .field('statusCode')
    .string()
    .done()
  .implement('startScan', async function () {
    // console.log('start');
    this.data.statusCode = 'STARTED';
    this.data.statusMessage = 'Scan started...';

    process.nextTick(() => {
      if (this.data.dryRun) {
        this.data.statusCode = 'DONE';
        this.data.statusMessage = 'Scan was a dry run';
      } else {
        this.data.statusCode = 'DONE';
        this.data.statusMessage = 'Scan finished without errors';
      }
    });
  }).done();
export default Scan;
