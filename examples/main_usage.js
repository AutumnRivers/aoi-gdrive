const aoi = require("../index.js");
const tokens = require("../googletokens.json");
const userInfo = require("../googleInfo.json");

if(!tokens) {
    if(userInfo.client_id == "EXAMPLE ID") {
        throw "It seems you haven't changed the googleInfo.json file! Please do this by following the instructions in the README.";
    }
    if(!userInfo.authCode) {
        console.error("No authentication code detected. An OAuth link will be generated, and the code will stop.\nPlease run the code again after inserting the auth code into googleInfo.json");
        aoi.generateOauth(userInfo.client_id, userInfo.client_secret, "http://localhost:8080/gcallback");
        throw "Remember to use this link to get your authentication code!";
    }
}

if(Date.now() > tokens.ExpiryDate) {
    aoi.updateAccess(tokens.AccessToken, tokens.ExpiryDate, tokens.RefreshToken);
    console.error("Access token was expired. It has been updated, so please re-run the code.");
} else {
    //List files
aoi.listFiles(tokens.AccessToken, tokens.RefreshToken, tokens.ExpiryDate, undefined, function(files) {
    console.log(files.files[0]);
});

//Upload a file
aoi.uploadFile(tokens.AccessToken, tokens.RefreshToken, tokens.ExpiryDate, 'examples/example_image.jpg');

//Download a file
aoi.downloadFile(tokens.AccessToken, tokens.RefreshToken, tokens.ExpiryDate, '1rqzXtTwHRVBIAsJ_9vinVaDolQhyQkhP', './drive/');

//List files, but in an array
aoi.listFilesSimple(tokens.AccessToken, tokens.RefreshToken, tokens.ExpiryDate, 3, function(files) {
    console.log(files);
})
}