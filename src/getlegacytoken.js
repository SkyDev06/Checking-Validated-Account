const axios = require("axios");
const https = require("https");
const { getURLToken, thisHTML } = require("./fetchHTML.js");
const { encodeString, getMetaServer, generateRandomMac, generateRandomRID } = require("./utils.js");

axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function getLegacyToken() {
    const meta = await getMetaServer();
    if (!meta) {
        throw new Error("Failed to retrieve meta token.");
    }

    const data = [
        `tankIDName|`,
        `tankIDPass|`,
        `requestedName|`,
        `f|1`,
        `protocol|214`,
        `game_version|5.07`,
        `fz|23331848`,
        `cbits|1024`,
        `player_age|24`,
        `GDPR|1`,
        `category|_16`,
        `totalPlaytime|0`,
        `klv|f8fa27954f52de781530a076e15fcbe8c6282dbfc9d41328b1a70acb7ffd849d`,
        `hash2|-2107014505`,
        `meta|${meta}`,
        `fhash|-716928004`,
        `rid|${generateRandomRID()}`,
        `platformID|0,1,1`,
        `deviceVersion|0`,
        `country|us`,
        `hash|320616336`,
        `mac|${generateRandomMac()}`,
        `wk|DE3272F32F6358A6A1F03D2D87E45E8E`,
        `zf|1249021625`
    ].join("\n");

    const headers = {
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "sec-ch-ua": `"Chromium";v="133", "Microsoft Edge WebView2";v="133", "Not(A:Brand";v="99", "Microsoft Edge";v="133"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
        "Origin": "null",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        "Accept-Language": "id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Content-Length": Buffer.byteLength(encodeString(data)),
    };

    try {
        const response = await axios.post(
            `https://login.growtopiagame.com/player/login/dashboard?valKey=40db4045f2d8c572efe8c4a060605726`,
            encodeString(data),
            { headers }
        );

        if (!thisHTML(response.data)) {
            throw new Error("Invalid response: Not an HTML document.");
        }

        return getURLToken(response.data);
    } catch (error) {
        throw new Error(`Error fetching Legacy Token: ${error.response ? error.response.data : error.message}`);
    }
}

module.exports = { getLegacyToken };
