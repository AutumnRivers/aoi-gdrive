const clinfo = require("./googleInfo.json"); //Holds stuff such as the client secret
const gDrive = require("./index.js");

var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(req.url);
    console.log(req.url);
    res.end();
}).listen(8080);

gDrive.generateOauth(clinfo.client_id, clinfo.client_secret, "https://localhost:8080/gcallback")