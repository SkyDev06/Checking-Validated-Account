const cheerio = require("cheerio");

function getURLToken(data) {
    const $ = cheerio.load(data);
    const loginLink = $("a.grow-login").attr("href");
    
    if (!loginLink) {
        throw new Error("Failed to fetch token: No login link found.");
    }

    return loginLink;
}

function extractToken_(data) {
    const $ = cheerio.load(data);
    return $('input[name="_token"]').val() || $('meta[name="csrf-token"]').attr("content") || null;
}

function thisHTML(data) {
    const $ = cheerio.load(data);
    return $("html").length > 0;
}

module.exports = { getURLToken, thisHTML, extractToken_ };