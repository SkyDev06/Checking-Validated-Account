class GrowtopiaAuthError extends Error {
    constructor(message, { code = "AUTH_ERROR", cause } = {}) {
        super(message);
        this.name = "GrowtopiaAuthError";
        this.code = code;
        if (cause) {
            this.cause = cause;
        }
    }
}

class ValidationError extends GrowtopiaAuthError {
    constructor(message, options = {}) {
        super(message, { ...options, code: "VALIDATION_ERROR" });
        this.name = "ValidationError";
    }
}

class NetworkError extends GrowtopiaAuthError {
    constructor(message, options = {}) {
        super(message, { ...options, code: "NETWORK_ERROR" });
        this.name = "NetworkError";
    }
}

module.exports = {
    GrowtopiaAuthError,
    ValidationError,
    NetworkError,
};
