import {getFolderEntries, getCachedEntries, writeCachedEntries} from './tree';
import {findById as findLibraryById} from '../../models/Library';
import {Artist,
  findOrCreate as findOrCreateArtist,
  findOne as findOneArtist} from '../../models/Artist';
import {Album,
  findOrCreate as findOrCreateAlbum,
  findOne as findOneAlbum} from '../../models/Album';
import {Track,
  findOrCreate as findOrCreateTrack,
  findOne as findOneTrack} from '../../models/Track';
import {File,
  findOrCreate as findOrCreateFile,
  findOne as findOneFile,
  findById as findFileById} from '../../models/File';

import FSTree from 'fs-tree-diff';
import Mediastic from 'mediastic';
import {mainStory} from 'storyboard';
import path from 'path';

export const getMediastic = () => {
  let mediastic = new Mediastic();

  mediastic.use((metadata, next) => {
    mainStory.info('scanner', 'Working on '+ metadata.path);
    next();
  });

  mediastic.use(Mediastic.tagParser());
  mediastic.use(Mediastic.fileNameParser());

  return mediastic;
}

export const titleCase = (str) => {
  if (/^((([A-Z]{2,}\b).?){2,}|([a-z]+\b.?\s?)+)$/.test(str)) {
    return str.toLowerCase().split(/(\.\s?|\s)/g)
      .filter((w) => !/^\s*$/.test(w))
      .map((w) => w[0].toUpperCase(0) + w.slice(1)).join(' ');
  }
  return str;
}

export const normalizeArtist = (str) => {
  return titleCase(str.replace(/feat.+$/g, '').trim());
}

const operationMapper = (models, mediastic, [operation, fileName, entry]) => {
  let filePath = path.join(entry.basePath, entry.relativePath);
  switch (operation) {
    case 'change':
      return operationMapper(models, mediastic, ['unlink', fileName, entry]).then(() => {
        return operationMapper(models, mediastic, ['create', fileName, entry]);
      });
    case 'create':
      return mediastic(filePath).then((metadata) => {
        return models.findOrCreateArtist({
          name: normalizeArtist(metadata.artist)
        }).then((artist) => {
          return Promise.resolve([metadata, artist])});
      }).then(([metadata, artist]) => {
        return models.findOrCreateAlbum({
          name: titleCase(metadata.album)
        }, {
          artist: artist.props._id
        }).then((album) => Promise.resolve([metadata, artist, album]));
      }).then(([metadata, artist, album]) => {

        return models.findOrCreateTrack({
          name: titleCase(metadata.title),
          album: album.props._id,
          trackNumber: (metadata.track + '').match(/^\d+/)[0] - 0,
        }, {
          artist: artist.props._id,
          duration: metadata.duration
        }).then(track => Promise.resolve([metadata, artist, album, track]));
      }).then(([metadata, artist, album, track]) => {

        let file = models.File({
          duration: metadata.duration,
          bitrate: metadata.bitrate,
          path: filePath,
          artist: artist.props._id,
          album: album.props._id
        });
        return file.create().then(() => {
          return Promise.resolve([metadata, artist, album, track, file])
        });
      }).then(([metadata, artist, album, track, file]) => {

        return models.findFileById(file.props._id);
      }).then(file => {

        mainStory.debug('scanner', 'Added a new track', {attach: file.props});
      }).catch(err => {
        mainStory.err('scanner', 'Library scan finished with errors', {attach: err});
      });
    case 'unlink':
      return findOneFile({path: filePath}).then((file) => {
        return file.remove();
      });
    case 'mkdir':
    case 'rmdir':
      return Promise.resolve();
  }
}

export const operationMapperFactory = (models, mediastic) => {
  return operationMapper.bind(null, models, mediastic);
}

export const scan = async (libraryId, mediastic = getMediastic()) => {
  let library = await findLibraryById(libraryId);

  let cached = new FSTree({
    entries: getCachedEntries(libraryId)
  });
  let currentEntries = getFolderEntries(library.props.path);
  let current = new FSTree({
    entries: currentEntries
  });

  let diff = cached.calculatePatch(current);
  let promises = diff.map(operationMapperFactory({
    findOrCreateTrack, findOrCreateAlbum, findOrCreateArtist, File, findFileById
  }, mediastic.call.bind(mediastic)));

  await Promise.all(promises)
  return writeCachedEntries(libraryId, currentEntries);
}
