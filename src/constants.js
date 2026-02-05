const DEFAULT_USER_AGENT =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const DEFAULT_TIMEOUT_MS = 15000;

const DEFAULT_ENDPOINTS = {
    metaServerUrl: "https://www.growtopia1.com/growtopia/server_data.php",
    legacyDashboardUrl:
        "https://login.growtopiagame.com/player/login/dashboard?valKey=40db4045f2d8c572efe8c4a060605726",
    loginValidateUrl: "https://login.growtopiagame.com/player/growid/login/validate",
};

const DEFAULT_PROTOCOL_VERSION = 214;
const DEFAULT_GAME_VERSION = "5.07";

module.exports = {
    DEFAULT_USER_AGENT,
    DEFAULT_TIMEOUT_MS,
    DEFAULT_ENDPOINTS,
    DEFAULT_PROTOCOL_VERSION,
    DEFAULT_GAME_VERSION,
};
