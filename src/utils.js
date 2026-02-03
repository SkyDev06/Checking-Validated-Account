const { DEFAULT_ENDPOINTS, DEFAULT_PROTOCOL_VERSION, DEFAULT_GAME_VERSION } = require("./constants.js");
const { NetworkError } = require("./errors.js");

function encodeString(str) {
    return encodeURIComponent(str)
        .replace(/%20/g, "+")
        .replace(/\n/g, "%0A")
        .replace(/_/g, "%5F")
        .replace(/\./g, "%2E")
        .replace(/-/g, "%2D");
}

async function getMetaServer(client, { endpoints = DEFAULT_ENDPOINTS, logger } = {}) {
    const url = endpoints.metaServerUrl;
    const postData = `version=${DEFAULT_GAME_VERSION}&platform=0&protocol=${DEFAULT_PROTOCOL_VERSION}`;

    try {
        const response = await client.post(url, postData, {
            headers: {
                "Host": "www.growtopia1.com",
                "User-Agent": "UbiServices_SDK_2022.Release.9_PC64_ansi_static",
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData),
            },
        });

        const metaMatch = response.data.match(/meta\|([^\r\n]+)/);
        if (!metaMatch) {
            throw new Error("Failed to extract meta token from server response.");
        }

        return metaMatch[1].trim();
    } catch (error) {
        if (logger && typeof logger.warn === "function") {
            logger.warn("Failed to fetch meta server", { error: error.message });
        }
        throw new NetworkError(
            `Error fetching meta server: ${error.response ? error.response.data : error.message}`,
            { cause: error }
        );
    }
}

function generateRandomMac() {
    const buffer = Buffer.alloc(6);
    buffer[0] = 0x02;
    
    for (let i = 1; i < 6; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
    }

    return [...buffer].map(byte => byte.toString(16).padStart(2, '0')).join(':');
}

function generateRandomRID() {
    let hex = "";
    const chars = "0123456789ABCDEF";
    
    for (let i = 0; i < 16; i++) {
        hex += chars[Math.floor(Math.random() * chars.length)];
    }

    return hex;
}

module.exports = { encodeString, getMetaServer, generateRandomMac, generateRandomRID };
