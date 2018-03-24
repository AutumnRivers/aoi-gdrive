[![Promo](https://i.imgur.com/df6Ff1T.png)](https://www.npmjs.com/package/aoi-gdrive)

# Aoi  
(aoi-gdrive)  
  
## Installation  
```shell  
$ npm install aoi-gdrive
```  
### Table Of Contents  
  
* [Requirements](#requirements)
* [Setup](#setup)
    - [Creating a project](#creating-a-project)
    - [Credentials](#credentials)
        * [Getting an access token](#grabbing-tokens)
        * [Updating your access token](#updating-your-access-token)
* [Usage](#usage)
    - [List Files](#list-files)
        * [List Files: Simple](#list-files-simple)
    - [Downloading Files](#downloading-files)
    - [Uploading Files](#uploading-files)
* [Support](#support)
  
## Requirements  
* NodeJS 8.x or later  
* npm 5.6.x or later (probably)  
* Project Client ID, Secret, and Redirect URL  
* Website host that can handle callback URLs (I suggest Glitch)  
## Setup  
This module is a bit more advanced than my previous one. Of course, that's to be expected when you're dealing with a secure API like Google's. So what are the steps?  
### Creating a project  
"It's easy as 123, ABC!"  
This is the easy part. Create a project from the [Google API Console](https://console.developers.google.com/apis).  
First off, I suggest enabling the Drive API.  
![Example](https://i.gyazo.com/f29e1f469cf67e0a687c1f2da8b8a86f.png)  
### Credentials  
![Screenshot](https://gyazo.com/6024543d869748a1fa7557eba7f5e84e.png)  
You need credentials. Period. Your project will not be able to function without them.  
**Create Credentials -> Help me choose**  
![HelpMeChoose](https://gyazo.com/de158fc907e01074f397e6609f216ada.png)  
After this, you should be able to install these credentials as a JSON file. Do that, and click your credential's name. Here, you'll find the client secret. Copy it, and save it somewhere like a sticky note. (I'm assuming you're running Windows.) You'll need it for later.  
### Creating the OAuth link  
I've even simplified *this* for you. It's really easy! Just run this in your js file:  
```js  
const aoi = require("aoi-gdrive");
const clInfo = {
    "id":"CLIENT_ID",
    "secret":"CLIENT_SECRET",
    "redURL":"REDIRECT_URL"
}

aoi.generateOauth(clInfo.id, clInfo.secret, clInfo.redURL)
```  
After this, an OAuth URL should be sent your console. Copy and paste it in your browser :>  

**NOTE**  
I do not collect any info! All this happens within *your* code. Go ahead, look through, I have nothing to hide.  
After giving your consent to your own project, you should be redirected to `/yourCallbackURL?code=AUTH_CODE`. Copy down this code, you need it for generating tokens.  
You can now delete this js file, you don't need the OAuth anymore.  
#### Grabbing tokens  
Forget my previous commit; that isn't actually your token. But it does help get your token!  
`<googleDrive>.getTokens(authCode)` will generate all the required tokens for you.   
#### Updating your access token  
Tokens don't last forever, obviously. That *is* why you're given an expiry date. But no worries! Updating your access token from your code is also VERY simple!  
`<googleDrive>.updateAccess(accessToken, expiryDate, refreshToken)`  
After this, a file called `googletokens.json` will be created/updated. Use this for your tokens!  
## Usage  
### List Files  
You can easily list most of the files in your Google Drive. While there is no sorting option, that's fine. From here, you can find metadata for files. You can use this metadata later for things such as downloading and deleting files.  

**Usage**: `<googleDrive>.listFiles(accessToken, refreshToken, expiryDate, pageSize, callback)`  

You already got the access token and refresh token, right? Yep, I'm gonna assume you did. So what's `pageSize`? It basically limits how many pages of your files you want to see. If you don't have a lot of files, you won't need this. Just put it as undefined. It defaults to `3`.  

`callback`  
oh nos a callback  
Yep, going from annoying promises to annoying callbacks. Life of a programmer \<3  
SO how do you use this? I'm glad you asked! You simply do something, as shown below.  
```js
<googleDrive>.listFiles(accessToken, refreshToken, expiryDate, 5, function(files) {
    console.log(files.files[0]);
    //This would return your most recently updated file's information in a cute little JSON <3
})
```  
Aaaaaaaaaaaand... yeah! That's all there is to it. Pretty neato, right? I'm glad you think so.  
#### List Files: Simple  
Don't like JSON? hahaha welcome to javascript, get used to it  
`listFilesSimple`  
Either way, I made this just for *you*! This is just like `listFiles`... but instead of returning a JSON, it returns an array of file name and IDs! You can easily read arrays, right?  
### Downloading Files  
**Usage**: `<googleDrive>.downloadFile(accessToken, refreshToken, expiryDate, fileID, path)`  

OOH NEW PARAMS  

`fileID` - You probably got this from `listFiles`. This is the ID of the file you want to download.  
`path` - This is the path where you want the file to be downloaded to. Defaults to the system default for temp files.  
Alright time to discuss on how to use this  
```js
<googleDrive>.downloadFile(accessToken, refreshToken, expiryDate, '1rqzXtTwHRVBIAsJ_9vinVaDolQhyQkhP');
```  
Yeah, that's it. No fancy callbacks or promises. Just download the file and get it over with. You even get to see the progress of the download in your console!  
Now, there's one small problem... it's saved as an empty file. No extension, and it has a lot of random letters and numbers. So I hope you made a note of your file's extension if it's not plain text!  
### Uploading Files  
Come on, would this be complete without the ability to upload files? The answer is no!  

**Usage**: `<googleDrive>.uploadFile(accessToken, refreshToken, expiryDate, filePath)`  

Simple enough. No fancy callbacks or promises again... Nice!  
`filePath` - The direct path to the file you want to upload.  
Alright, example time.  
```js
<googleDrive>.uploadFile(accessToken, refreshToken, expiryDate, './examples/example_image.jpg');
```  
Only thing you get back is confirmation the deed is done, along with the name of the file so you can find it in your Drive. WOO

## Support  
[![AoiSupport](https://i.imgur.com/XI5jdip.png)](https://discord.gg/w9NwMvA)
