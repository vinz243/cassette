import {Artist, Album, Track, File} from '../models';
import Controller from './Controller';

const routes = new Controller(File).done();

export default routes;
