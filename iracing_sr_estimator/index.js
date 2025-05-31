const util = require('./util');
require('dotenv').config({path: './assets/.env'})


const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const hashedPassword = util(email, password);

console.log('password:::', hashedPassword);