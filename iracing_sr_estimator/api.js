// const util = require('./util');
import tough from 'tough-cookie';
import fetchCookie from 'fetch-cookie';
import fs from 'fs';

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
    // .then(response => console.log("Response:::", response))
    // .then(response => {
    //     if(response.status === 200){
    //         getCurrentSR(932916, 6)
    //     }
    // })
    console.log("Auth Response:::", response);
    persistCookies()
    // const authCookie = response.headers.get('set-cookie')
    return true;
}

export const getCurrentSR = async (userId, categoryId, email, password) => {
    const url = `https://members-ng.iracing.com/data/member/chart_data?cust_id=${userId}&category_id=${categoryId}&chart_type=3`;
    let authAttempt = 0; 

    while (authAttempt < 3){
        const res = await fetchWithCookies(url);
        if(res.ok){
            persistCookies();
            return await res.json();
        }

        if(res.status === 401 && authAttempt < 2){
            await getAuthorization(email, password);
        }else {
            console.log("Request failed:::")
        }

        authAttempt++;
    }

    const res = await fetchWithCookies(url)
  
    persistCookies();

    const json = await res.json();
    // console.log("Json:::", json);
    return json;
}

export const getResultFromLink = async (link) => {
    const res = await fetch(link);
    return await res.json();
}