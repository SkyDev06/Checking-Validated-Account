const axios = require("axios");
const https = require("https");

axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

function encodeString(str) {
    return encodeURIComponent(str)
        .replace(/%20/g, "+")
        .replace(/\n/g, "%0A")
        .replace(/_/g, "%5F")
        .replace(/\./g, "%2E")
        .replace(/-/g, "%2D");
}

async function getMetaServer() {
    const url = "https://www.growtopia1.com/growtopia/server_data.php";
    const postData = "version=5.07&platform=0&protocol=214";

    try {
        const response = await axios.post(url, postData, {
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
        throw new Error(`Error fetching meta server: ${error.response ? error.response.data : error.message}`);
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
