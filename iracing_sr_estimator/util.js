const crypto = require('crypto');

const retrieveHash = (userName, password) => {
    const hash = crypto.createHash('sha256').update(`${password}${userName.toLowerCase()}`, 'utf8').digest();
    return hash.toString('base64');
}

module.exports = retrieveHash;