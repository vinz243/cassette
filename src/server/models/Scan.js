import Model from './Model';

let Scan = new Model('scan')
  .field('startDate')
    .int()
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

    setTimeout(() => {
      // console.log('done');
      this.data.statusCode = 'DONE';
      this.data.statusMessage = 'Scan finished without errors';
    }, 1337);
  }).done();
export default Scan;
