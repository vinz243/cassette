import {Artist, Album, Track} from '../models';
import Controller from './Controller';

const routes = new Controller(Track).done();

export default routes;
