const axios = require("axios");
const https = require("https");
const { DEFAULT_USER_AGENT, DEFAULT_TIMEOUT_MS } = require("./constants.js");

function createHttpClient({
    timeoutMs = DEFAULT_TIMEOUT_MS,
    userAgent = DEFAULT_USER_AGENT,
} = {}) {
    return axios.create({
        timeout: timeoutMs,
        headers: {
            "User-Agent": userAgent,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
}

module.exports = { createHttpClient };
