import search from './store';
import indexers from './indexers';
import downloaders from './downloaders';
import artworks from './artworks';
import jobs from './jobs';

export default Object.assign({}, search, indexers, downloaders, artworks, jobs);
