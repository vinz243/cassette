import {Artist, Album, Tracks} from '../models';
import Controller from './Controller';
import Lazy from 'lazy.js';

const routes = new Controller(Artist).done();

export default routes;
