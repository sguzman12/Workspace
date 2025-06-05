import * as util from './util.js';
import * as api from './api.js';
import dotenv from 'dotenv';

dotenv.config({ path: './assets/.env' });

// const email = process.env.EMAIL;
// const password = process.env.PASSWORD;
const userPin = process.env.USERPIN;

// Get last 10 races SR
const result = await api.getCurrentSR(userPin, 6);
const json = await api.getResultFromLink(result.link);

// Get Member Info
// const result = await api.getMemberInfo();
// const json = await api.getResultFromLink(result.link);

console.log('result:::', JSON.stringify(json, null, 2));
// console.log("test:::", util.calculateFutureSafetyRating(3.50, .0075, 90, 2, 30));
