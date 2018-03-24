const clinfo = require("./googleInfo.json"); //Holds stuff such as the client secret
const gDrive = require("./index.js");

gDrive.getTokens(clinfo.web.authCode, clinfo.web.client_id, clinfo.web.client_secret, "https://localhost:8080/gcallback")