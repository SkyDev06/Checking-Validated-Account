const { getLegacyToken } = require("./getlegacytoken.js");
const { extractToken_ } = require("./fetchHTML.js");
const { DEFAULT_ENDPOINTS, DEFAULT_USER_AGENT, DEFAULT_TIMEOUT_MS } = require("./constants.js");
const { createHttpClient } = require("./httpClient.js");
const { GrowtopiaAuthError, NetworkError } = require("./errors.js");
const { assertNonEmptyString } = require("./validators.js");

class GrowtopiaAuth {
    constructor({
        client,
        endpoints = DEFAULT_ENDPOINTS,
        userAgent = DEFAULT_USER_AGENT,
        timeoutMs = DEFAULT_TIMEOUT_MS,
        logger,
    } = {}) {
        this.client = client || createHttpClient({ timeoutMs, userAgent });
        this.endpoints = endpoints;
        this.userAgent = userAgent;
        this.timeoutMs = timeoutMs;
        this.logger = logger;
    }

    async fetchLoginPage(legacyUrl) {
        const response = await this.client.get(legacyUrl, {
            headers: {
                "User-Agent": this.userAgent,
            },
            responseType: "text",
            withCredentials: true,
        });

        const cookies = response.headers["set-cookie"];
        if (!cookies || cookies.length === 0) {
            throw new GrowtopiaAuthError("No cookies received from login page", {
                code: "NO_COOKIES",
            });
        }

        const token = extractToken_(response.data);
        if (!token) {
            throw new GrowtopiaAuthError("Failed to extract token from HTML", {
                code: "MISSING_TOKEN",
            });
        }

        return { cookies, token };
    }

    async validateCredentials({ growid, password, token, cookies, referer }) {
        const loginData = new URLSearchParams();
        loginData.append("_token", token);
        loginData.append("growId", growid);
        loginData.append("password", password);

        const loginResponse = await this.client.post(
            this.endpoints.loginValidateUrl,
            loginData,
            {
                headers: {
                    "User-Agent": this.userAgent,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": cookies.join("; "),
                    "X-XSRF-TOKEN": token,
                    "Referer": referer,
                    "Origin": "https://login.growtopiagame.com",
                    "Accept": "application/json, text/plain, */*",
                },
                withCredentials: true,
            }
        );

        return loginResponse.data;
    }

    async checkAccount(growid, password) {
        assertNonEmptyString(growid, "growid");
        assertNonEmptyString(password, "password");

        try {
            const legacyUrl = await getLegacyToken({
                client: this.client,
                endpoints: this.endpoints,
                logger: this.logger,
            });
            if (!legacyUrl) {
                throw new GrowtopiaAuthError("Failed to retrieve legacy token URL", {
                    code: "MISSING_LEGACY_URL",
                });
            }

            const { cookies, token } = await this.fetchLoginPage(legacyUrl);

            return await this.validateCredentials({
                growid,
                password,
                token,
                cookies,
                referer: legacyUrl,
            });
        } catch (error) {
            if (error instanceof GrowtopiaAuthError) {
                throw error;
            }
            throw new NetworkError(`Error in checkAccount: ${error.message}`, {
                cause: error,
            });
        }
    }
}

async function checkAccount(growid, password, options = {}) {
    const auth = new GrowtopiaAuth(options);
    return auth.checkAccount(growid, password);
}

module.exports = {
    GrowtopiaAuth,
    checkAccount,
};
