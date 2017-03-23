import {fetchable, oneToMany, updateable, createable} from './Controller';
import merge from 'lodash/merge';
import process from 'process';
import {Scan, find, findById} from '../models/Scan';


export default merge({},
  fetchable('scan', find, findById), createable('scan', Scan)
);
