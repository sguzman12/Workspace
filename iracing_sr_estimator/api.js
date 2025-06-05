// const util = require('./util');
import tough from 'tough-cookie';
import fetchCookie from 'fetch-cookie';
import fs from 'fs';
import dotenv from 'dotenv';
import * as util from './util.js';

dotenv.config({ path: './assets/.env' });

const jarFile = './assets/cookie-jar.txt';

let cookieJar;
if (fs.existsSync(jarFile)) {
    const cookieJson = JSON.parse(fs.readFileSync(jarFile, 'utf-8'));
    cookieJar = tough.CookieJar.fromJSON(cookieJson);
} {
    cookieJar = new tough.CookieJar();
}

const fetchWithCookies = fetchCookie(fetch, cookieJar);
const persistCookies = () => {
    fs.writeFileSync(jarFile, JSON.stringify(cookieJar.toJSON(), null, 2));
};

export const fetchGetWithAuthorization = async (url, email = process.env.EMAIL, password = process.env.PASSWORD) => {
    let authAttempt = 0;

    while (authAttempt < 3) {
        const res = await fetchWithCookies(url);
        if (res.ok) {
            persistCookies();
            return await res.json();
        }

        if (res.status === 401 && authAttempt < 2) {
            const hashPassword = util.retrieveHash(email, password);
            await getAuthorization(email, hashPassword);
        } else {
            console.log("Request failed:::")
        }

        authAttempt++;
    }

    const res = await fetchWithCookies(url)

    persistCookies();

    const json = await res.json();
    return json;
}

export const getAuthorization = async (email, password) => {
    const response = await fetchWithCookies('https://members-ng.iracing.com/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    persistCookies()
    return true;
}

export const getCurrentSR = async (userId, categoryId) => {
    const url = `https://members-ng.iracing.com/data/member/chart_data?cust_id=${userId}&category_id=${categoryId}&chart_type=3`;
    return await fetchGetWithAuthorization(url);
}

export const getMemberInfo = async (userPin = process.env.USERPIN) => {
    const url = `https://members-ng.iracing.com/data/member/get?cust_ids=${userPin}&include_licenses=true`
    return await fetchGetWithAuthorization(url);
}

export const getResultFromLink = async (link) => {
    const res = await fetch(link);
    return await res.json();
}