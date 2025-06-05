// const crypto = require('crypto');
import crypto from 'crypto';

export const retrieveHash = (userName, password) => {
    const hash = crypto.createHash('sha256').update(`${password}${userName.toLowerCase()}`, 'utf8').digest();
    return hash.toString('base64');
}

/**
 * Returns calculated possible future SR 
 * SR_new = SR_current + K x (C_session / I_session - CPI_current)
 * 
 * Sr_new: Estimated SR after the session
 * SR_current: Current SR in category
 * K: Scaling constant based on license, SR range, and weighted towards practice, quali, or race
 * C_session: Corners expected to complete in the session
 * I_session: Incident points expected
 * CPI_current: Current Corners Per Incident
 */
export const calculateFutureSafetyRating = (currentSR, weight, cornersExpected, incidents, cpi) => {
    return currentSR + weight * ((cornersExpected / incidents) - cpi);
}