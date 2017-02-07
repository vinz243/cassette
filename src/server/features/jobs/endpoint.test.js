
import app from '../../server.js';
import test from 'ava';
import supertest from 'supertest-as-promised';

const request = supertest(app);
