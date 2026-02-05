const { ValidationError } = require("./errors.js");

function assertNonEmptyString(value, fieldName) {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new ValidationError(`${fieldName} must be a non-empty string.`);
    }
}

module.exports = { assertNonEmptyString };
