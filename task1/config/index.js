let fs = require("fs");

// define constants
const DEFAULT_CONFIG_FILE_PATH = `./config/config.json`;

// create the JSON configuration object
let defaultContents = fs.readFileSync(DEFAULT_CONFIG_FILE_PATH);
let defaultJson = JSON.parse(defaultContents);
let result = defaultJson;

// export the configuration
module.exports = result;
