// const util = require('./util');
// const api = require('./api')
// require('dotenv').config({path: './assets/.env'})
import * as util from './util.js';
import * as api from './api.js';
import dotenv from 'dotenv';

dotenv.config({ path: './assets/.env' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const hashedPassword = util.retrieveHash(email, password);


// const cookies = await api.getAuthorization(email, hashedPassword);
const result = await api.getCurrentSR(932916, 6, email, hashedPassword);

const json = await api.getResultFromLink(result.link);

console.log('result:::', json);
// console.log("test:::", util.calculateFutureSafetyRating(3.50, .0075, 90, 2, 30));
