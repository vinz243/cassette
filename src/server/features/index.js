import search from './store';
import indexers from './indexers';
import downloaders from './downloaders';

export default Object.assign({}, search, indexers, downloaders);
