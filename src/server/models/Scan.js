import child_process from 'child_process';
import Library from './Library';
import Album from './Album';
import Artist from './Artist';
import Track from './Track';
import File from './File';
import Model from './Model';
import process from 'process';

export const processResult = async (res) => {
  if(res.status === 'done') {
    let data = res.data;
    for (let artistName of Object.keys(data)) {
      let artist = (await Artist.find({name: artistName}))[0];
      if (!artist) {
        artist = new Artist(artistName);
        await artist.create();
      }
      for (let albumName of Object.keys(data[artistName])) {
        let album = (await Album.find({name: albumName}))[0];
        if (!album) {
          album = new Album(albumName);
          album.data.artistId = artist.data._id;
          await album.create();
        }
        for (let t of data[artistName][albumName]) {
          let track = (await Track.find({name: t.trackTitle}))[0];
          if (!track) {
            track = new Track(t.trackTitle);
            track.data.artistId = artist.data._id;
            track.data.albumId = album.data._id;
            track.data.duration = t.duration;
            await track.create();
          }
          let file = new File({
            path: t.path,
            duration: t.duration, // TODO: Bitrate and everything
            bitrate: t.bitrate,
            artistId: artist.data._id,
            albumId: album.data._id,
            trackId: track.data._id
          });
          await file.create();

        }
      }
    }
  }
}

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
        Library.findById(this.data.libraryId).then((dir) => {
          let child = child_process.fork(require.resolve('../scripts/music_scanner'));

          child.send({
            action: 'set_config',
            data: {
              dir: dir.data.path
            }
          });

          child.send({action: 'execute'});

          child.on('message', (res) => {
            if (res.status === 'LOG') {
              console.log('child: ' + res.msg);
              return;
            }
            processResult(res).then(() => {
              this.data.statusCode = 'DONE';
              this.data.statusMessage = 'Scan finished without errors';
              this.update();
            }).catch((err) => {
              this.data.statusCode = 'FAILED';
              this.data.statusMessage = err;
            });
          });
        });


      }
    });
  }).done();
export default Scan;
