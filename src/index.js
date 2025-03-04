const axios = require("axios");
const https = require("https");
const { getLegacyToken } = require("./getlegacytoken.js");
const { extractToken_ } = require("./fetchHTML.js");

axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function checkAccount(growid, password) {
    try {
        const getURLToken = await getLegacyToken();
        if (!getURLToken) throw new Error("Failed to retrieve legacy token URL");

        const response = await axios.get(getURLToken, {
            headers: { 
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            },
            responseType: "text",
            withCredentials: true,
        });

        const cookies = response.headers["set-cookie"];
        if (!cookies || cookies.length === 0) throw new Error("No cookies received from login page");

        const token = extractToken_(response.data);
        if (!token) throw new Error("Failed to extract token from HTML");

        const loginData = new URLSearchParams();
        loginData.append("_token", token);
        loginData.append("growId", growid);
        loginData.append("password", password);

        const loginResponse = await axios.post(
            "https://login.growtopiagame.com/player/growid/login/validate",
            loginData, 
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": cookies.join("; "),
                    "X-XSRF-TOKEN": token,
                    "Referer": getURLToken,
                    "Origin": "https://login.growtopiagame.com",
                    "Accept": "application/json, text/plain, */*",
                },
                withCredentials: true,
            }
        );

        return loginResponse.data;
    } catch (error) {
        throw new Error(`Error in checkAccount: ${error.message}`);
    }
}

module.exports = { checkAccount };