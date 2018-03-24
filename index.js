const {google} = require("googleapis"); //Make the code a whole lot easier to withstand
const OAuth2 = google.auth.OAuth2; //Gotta get that oauth in there
const userInfo = require("./googleInfo.json");
const fs = require("fs"); //For the token grabber
const chk = require('chalk'); //For fanciness
const uuid = require('uuid');
const path = require('path');
//Chalk set up
const error = chk.bold.red;
const success = chk.bold.green;
const progress = chk.inverse;

if(!userInfo) { throw "No googleInfo.json detected. Please reread the README for instructions."; }
if(!userInfo.client_id || !userInfo.client_secret || !userInfo.redirect_uris) { throw "Your googleInfo is not set up correctly. Please reread the README for instructions."; }

var OAuth2Client = new OAuth2(
    userInfo.client_id,
    userInfo.client_secret,
    userInfo.redirect_uris[0]
);

/**
 * Generates an OAuth link that will let you access Google Drive
 * @param {string} clientID The client ID of your project (refer to README if confused)
 * @param {string} clientSecret The client secret of your project (refer to README if confused)
 * @param {string} redirectURL One redirect URL associated with your project
 * @returns {string} The full URL for the OAuth2 screen
 */
exports.generateOauth = (clientID, clientSecret, redirectURL) => {
    {
        const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive.file']
        //OAuth setup
var url = OAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
    approval_prompt: 'force'
});
console.log(url)
    }
};

/**
 * Gets the tokens required for accessing the Google Drive API
 * @param {string} authCode The authentication code you got from generateOauth
 * @returns {string} The access token, refresh token, and expiry date. They are also auto-written to a file.
 */
exports.getTokens = (authCode) => {
    {
        OAuth2Client.getToken(authCode, function(err, tokens) {
            if(!err) {
                console.log(("Here are your tokens!\n" + `Access Token: ${tokens.access_token}\nExpiry date: ${tokens.expiry_date}\nRefresh Token: ${tokens.refresh_token}\nThese have been written into a googletokens.json file.`));
                if(!"./googletokens.json") {
                fs.appendFile("googletokens.json", `{"AccessToken":"${tokens.access_token}","ExpiryDate":"${tokens.expiry_date}","RefreshToken":"${tokens.refresh_token}"}`);
                } else {
                    fs.writeFileSync('googletokens.json', `{"AccessToken":"${tokens.access_token}","ExpiryDate":"${tokens.expiry_date}","RefreshToken":"${tokens.refresh_token}"}`, function(error) {
                        if(error) { throw error; }
                    });
                }
            } else {
                throw err;
            }
        });
    }
};

/**
 * Used for quickly refreshing the access token if it expires
 * @typedef {number} unixTime
 * @param {string} accessToken Your access token
 * @param {unixTime} expiryDate The unix time for when your access token expires
 * @param {string} refreshToken Your refresh token
 * @returns Confirmation that the token was updated. Auto-updates the file with the tokens.
 */
exports.updateAccess = (accessToken, expiryDate, refreshToken) => {
    OAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate
    });
    {
        OAuth2Client.refreshAccessToken(function(err, tokens){
            if(err) { throw err; }
            fs.writeFileSync('googletokens.json', `{"AccessToken":"${tokens.access_token}","ExpiryDate":"${tokens.expiry_date}","RefreshToken":"${tokens.refresh_token}"}`, function(error) {
                if(error) { throw error; }
            });
            console.log(success("Successfully updated the access token."));
        })
    }
};

/**
 * Generates a JSON of all your Drive files.
 * @param {string} accessToken Your access token
 * @param {string} refreshToken Your refresh token
 * @param {unixTime} expiryDate The unix time for when your access token expires
 * @param {number=} [pageSize=3] How many files you want to be shown. Use Infinity if you would like to list ALL of your files.
 * @returns {JSON} Returns a full JSON of your Google Drive files
 */
exports.listFiles = (accessToken, refreshToken, expiryDate, pageSize, callback) => {
    if(!pageSize) {
        var pageSize = 3;
    }

    if(!expiryDate) throw "Please provide your expiry date."

    if(Date.now() > expiryDate) {
        //TODO: Automatically refresh the access token when an outdated expiry date is provided.
throw "Your access token is expired. Please generate a new one with updateAccess."
}

    if(!accessToken || !refreshToken) { throw "You seem to be missing a token! You can generate them via generateOauth."; }
    OAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate
    });
    var gdrive = google.drive({
        version: "v3",
        auth: OAuth2Client
    });
    function getFiles() {
    gdrive.files.list({pageSize: pageSize}, (err, res) => {
        if(err) {
            throw err
        }
    callback(res.data);
    })};
    getFiles()
};

/**
 * Cut the JSON out and forget it - just get file details nice and quick in a neat little array.
 * @param {string} accessToken Your access token
 * @param {string} refreshToken Your refresh token
 * @param {unixTime} expiryDate The unix time for when your access token expires
 * @param {number=} [pageSize=3] How many files you want to be shown. Use Infinity if you would like to list ALL of your files (NOT RECCOMENDED).
 * @returns {Array} Returns an array of your Drive files with their name and ID.
 */
//TODO: get this done <3
exports.listFilesSimple = (accessToken, refreshToken, expiryDate, pageSize, callback) => {
    if(!pageSize) {
        var pageSize = 3;
    }

    if(!expiryDate) throw "Please provide your expiry date."

    if(Date.now() > expiryDate) {
        //TODO: Automatically refresh the access token when an outdated expiry date is provided.
throw "Your access token is expired. Please generate a new one with updateAccess."
}

    if(!accessToken || !refreshToken) { throw "You seem to be missing a token! You can generate them via generateOauth."; }
    OAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate
    });
    var gdrive = google.drive({
        version: "v3",
        auth: OAuth2Client
    });
    function getFiles() {
    gdrive.files.list({pageSize: pageSize}, (err, res) => {
        if(err) {
            throw err
        }
        var simplified = [];
        res.data.files.forEach(file => {
            simplified.push(`${file.name} | ${file.id}`);
        })
    callback(simplified);
    })};
    getFiles();
};

/**
 * Downloads a file from your Drive.
 * @param {string} accessToken Your access token
 * @param {string} refreshToken Your refresh token
 * @param {unixTime} expiryDate The unix time for when your access token expires
 * @param {string} fileID The id of the file you want to download.
 * @param {path=} dlPath The path to which the file should be downloaded. If left blank, it will download to the system's default temp file folder
 * @returns {} Confirmation that the file was downloaded without failure. Logs to console.
 */
exports.downloadFile = (accessToken, refreshToken, expiryDate, fileID, dlPath) => {
    var callback = function(filepath){ console.log(success("File downloaded without failure <3\n" + filepath)) }
    if(!expiryDate) throw "Please provide your expiry date."

    if(Date.now() > expiryDate) {
        //TODO: Automatically refresh the access token when an outdated expiry date is provided.
throw "Your access token is expired. Please generate a new one with updateAccess."
}

    if(!dlPath) {
        var dlPath = os.tmpdir();
    };

    var dlPath = path.join(dlPath, uuid.v4());
    var dir = fs.createWriteStream(dlPath);

    if(!accessToken || !refreshToken) { throw "You seem to be missing a token! You can generate them via generateOauth."; }
    OAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate
    });
    var gdrive = google.drive({
        version: "v3",
        auth: OAuth2Client
    });
    function downloadFiles() {
        gdrive.files.get({
            fileId: fileID,
            alt: 'media'
        },
        {
        responseType: 'stream'
        }, (err, res) => {
            if(err) throw err;
        res.data
            .on('end', () => {
                callback(dlPath);
            })
            .on('error', (err) => {
                console.error(error("File download stopped due to error."))
                throw err;
            })
            .on('data', data => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(progress(`${data.length}b downloaded`));
            })
            .pipe(dir);
        })
    }
    downloadFiles();
};

/**
 * Uploads a file to your Drive.
 * @param {string} accessToken Your access token
 * @param {string} refreshToken Your refresh token
 * @param {unixTime} expiryDate The unix time for when your access token expires
 * @param {path} uPath The path to where the file you want to upload is
 * @returns {} Confirmation that the file was uploaded without failure. Logs to console.
 */
exports.uploadFile = (accessToken, refreshToken, expiryDate, uPath) => {
    if(!expiryDate) throw "Please provide your expiry date."

    if(Date.now() > expiryDate) {
        //TODO: Automatically refresh the access token when an outdated expiry date is provided.
throw "Your access token is expired. Please generate a new one with updateAccess."
}
    if(!uPath) throw 'No file path specified! Please give a path.'
    const fileSize = fs.statSync(uPath).size;

    var callback = function(data){ console.log(success('File uploaded without failure <3\n' + data.name)) }

    if(!accessToken || !refreshToken) { throw "You seem to be missing a token! You can generate them via generateOauth."; }
    OAuth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: expiryDate
    });
    var gdrive = google.drive({
        version: "v3",
        auth: OAuth2Client
    });
    function uploadContent(){
        gdrive.files.create({
            resource: {
                'name': path.basename(uPath)
            },
            media: {
                body: fs.createReadStream(uPath)
            }
         }, {
                onUploadProgress: evt => {
                  const progress = (evt.bytesRead / fileSize) * 100;
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  process.stdout.write(`${Math.round(progress)}% complete`);
                }
        }, (err, res) => {
            if(err) {
                console.log(error('Error uploading file! :('))
                throw err;
            }
            callback(res.data);
        })
    }
    uploadContent();
}