const { checkAccount } = require("./src/index.js");

(async () => {
    try {
        const result = await checkAccount("growID", "Password");
        console.log(result)
    } catch (error) {
        console.error("Login Error:", error.message);
    }
})();