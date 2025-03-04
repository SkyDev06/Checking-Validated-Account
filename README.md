# Checking-Validated-Account

A Node.js application that verifies whether a Growtopia account is validated or invalid using only GrowID and Password. The tool attempts authentication with the provided credentials and determines the account's status based on the server's response.

## Features
- ✅ **Check Growtopia Account Validation** - Determines whether an account is validated or not.
- 🔒 **Secure Authentication** - Uses Growtopia’s legacy authentication method with token extraction.
- 🍪 **Automatic Cookie Handling** - Manages authentication cookies seamlessly.
- 🔄 **Randomized Identifiers** - Generates random `MAC` and `RID` for improved request simulation.
- 🛠 **Error Handling** - Provides clear error messages for debugging.
- ⚡ **Lightweight & Fast** - Optimized with `axios` for quick HTTP requests.

## Installation
To install the package, use npm:
```sh
npm i checking-validated-account
```

## Usage
Example implementation in a Node.js script:
```js
const { checkAccount } = require("checking-validated-account");

async function main() {
    try {
        const result = await checkAccount("YourGrowID", "YourPassword");
        console.log(result);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
```

## Expected Output
When an account is successfully validated, the function returns:
```json
{
  "status": "success",
  "message": "Account Validated.",
  "token": "",
  "url": "",
  "accountType": "growtopia",
  "accountAge": 2
}
```

## Version
- **V1.0.0** - Initial release.

## License
This project is licensed under the **MIT License**.

## Contribution
Feel free to contribute by submitting issues or pull requests.

---

Made with ❤️ by **SkyDev06**
