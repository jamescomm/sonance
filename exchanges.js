console.log("");
console.log("//************************* Welcome to exchangess **************************//");
console.log("");

const https = require('https');
    //import env 
    require('dotenv').config()
    
    //Import Config
    const config = require('./lib/config');
    

    // connect to db
config.dbConfig(config.cfg, (err) => {
    if (err) {
        console.log(err, 'exiting the app.');
        return;
    }

 // set server home directory
//    app.locals.rootDir = __dirname;

    // config express
  //  config.expressConfig(app, config.cfg.environment);

    // load external modules
    const express = require("express");


    // init express app
    const app = express();
app.use(function(req, res, next) { 
res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, browser_id");
  next();
});



//--------------------------------------------------------------------------------------
var fs = require('fs')
// var key = `-----BEGIN PRIVATE KEY-----
// MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBfe21ZlVNj//b
// ddjcOeIoKlBm1MG8T+OiAjHQnTDvyqugmJoCH2P98Cj3kWRB37pkM3Kd5iAKxqnJ
// MkWqCZMwj51t4tFXoywSakeu3yUBIPuOWN0ECaZl2B/Rs/iix1PgaIpAE/cdEL/S
// ieXcuvhbh1eOO9Ps2XJgHJXt9jm9WTb/Dv63pswefqwA6jyZqvBski88wgLoatvU
// GV60J2lS6sUFU0rQmovsF4B1tcAY3GqFypPOSs4v3lGFHJtLi+nWoXdXwjo/VA9+
// RjIZUTfSrxmkYH8serBwe8Cy53sJcJw7pq1X1q4msRt45d+q0tf9oMgw2bbYwdok
// RnYmRo0pAgMBAAECggEAOV/G4bgzaSle28to/3xmdDR/3M4PmHAz9nEiJlLGFQSK
// ubcmS6TVOJJDA43oJaRal6WtweZf7/ISnGc8wvvN2mNrcg8EtjDbO6aqFM90II6Q
// KRhuiOj3n1FjtgHgoxvp4iv9epyw9LxntN1Q/I+wXyuVqcZRw/SCdr9jMcmGO3+5
// wBH+fgr4Hn04itralc9s5zl8MZ6dzA7j3/Wrd5zBdJ5NYXzUBf6zoiwGh5PB0Ogu
// 717XeumupqZ91DkU/UCO3wRSxQsSbZNuQNmcw/puamgiQPEpyZ382DqMAVP8IBW7
// cqkYowwp9n59sBLhqJldpyDWQ6/37JWGkXfFBtJvdQKBgQDmDfAvNGlyxtUaIaAC
// nIA2k/a6bdC7F0Ywe14gg0zJDrwf7OqwYZK8hEtc+mJMiDIPyzD8TRCnAYR2NZeK
// HxoGSyrn9QgQ9HugQX88V0soslYJwUN8YTbhpByC7KiTy4tj976Y//69R7f1OWvU
// tO9PBefVH9RmPjc3LEm4GmJONwKBgQDXUF4uRNgRubVBF24XkjK9PH8dWSyYXSRN
// JSZuCHzRHy5eRw2YHhVKobnD+rWq6UiLIlSu8ZF/ty6TVaWJcWaY+bI2XiG5kqSI
// htp2N8CadtnPksNKPJKlGfjGZeiE1cYwcr6GxBev6sirLIn5GqfXvQ33QwzvKlmx
// 9c8n2RNPnwKBgFqDV2GrNGXVNxj968+7NXLDyopVFI/Xu2Tt1P3jyv08D+Zbt4bI
// DQyg3GnrlWtZFqFCJ7bMt2WN4kkEEuhkDkA1qN70eET7e/x0aJQcIFUVvWY/JMc2
// FHq4sAMPC9CCgAhH/DSEW/yq0ATqn7NjsNgdkbY3vMCxb9YEVcjakJ0HAoGBAJXW
// GORsBk03hhpZGsUOeX7VZcRftTgGwWdqLfcusuW4pET5f01XygtYxnTKuLfKhjBE
// 4Nepxk4xhRkE5iDiqLpWMZ3CHggNM7DK36abH86eXO8lu/+ibY61pzkx3ADs33IB
// t/MC7VT/t0vfv9h5o0nwB5MFty+MskS0wceCOf0TAoGBAL7ZQjDpknLdawBFFw6V
// eYWw6uT34l1c/KuuFRiXonusgFJW/cApSSVGrXydKFUgySqQTs9Fq80eI4WmmU0e
// pBy+pEuZtEdaodHRqSJacJKPX/B+qFv4UCGUR/xAaR9Rm7gAmtKwNgnU3VxCF9OK
// QyZpGZvoiy5kZepEYdsfnXRj
// -----END PRIVATE KEY-----`

// var cert = `-----BEGIN CERTIFICATE REQUEST-----
// MIIDJzCCAg8CAQAwga0xCzAJBgNVBAYTAklOMRYwFAYDVQQIDA1VdHRlciBQcmFk
// ZXNoMRMwEQYDVQQHDApHaGF6aWEgQmFkMR0wGwYDVQQKDBRjcnlwdG9rZW54Y2hh
// bmdlLmNvbTENMAsGA1UECwwEVGVjaDEdMBsGA1UEAwwUY3J5cHRva2VueGNoYW5n
// ZS5jb20xJDAiBgkqhkiG9w0BCQEWFWFsdGNvaW5hc2lhQGdtYWlsLmNvbTCCASIw
// DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMF97bVmVU2P/9t12Nw54igqUGbU
// wbxP46ICMdCdMO/Kq6CYmgIfY/3wKPeRZEHfumQzcp3mIArGqckyRaoJkzCPnW3i
// 0VejLBJqR67fJQEg+45Y3QQJpmXYH9Gz+KLHU+BoikAT9x0Qv9KJ5dy6+FuHV447
// 0+zZcmAcle32Ob1ZNv8O/remzB5+rADqPJmq8GySLzzCAuhq29QZXrQnaVLqxQVT
// StCai+wXgHW1wBjcaoXKk85Kzi/eUYUcm0uL6dahd1fCOj9UD35GMhlRN9KvGaRg
// fyx6sHB7wLLnewlwnDumrVfWriaxG3jl36rS1/2gyDDZttjB2iRGdiZGjSkCAwEA
// AaA0MBgGCSqGSIb3DQEJAjELDAlDcnlwdG9rZW4wGAYJKoZIhvcNAQkHMQsMCWFk
// bWluQDEyMzANBgkqhkiG9w0BAQsFAAOCAQEAg6UnUKv2WkpdsLmkCaGtc65qApwH
// L/D3xHBTal4bOieEwGRou4auarzgH5Uecn4CeZ7z2hWycRc1DNbKmts253GGRuDX
// CbsEcbgP0ajiwRJyaNUIxutA8RH6AINq4hSZVUp81u1pemF/fjha1b6ociU6kc80
// WixKq4jUb/JX183sGvacSBGX2Akc1PHWWucVwNwALlcjgX2+3NNGdc78hVdpSPsu
// xHgSHIpWuYspx8bOdIquotRpg9CLnzYbYxxdVW1CRXiON/qiKgYCzhgRAb+7j30x
// HRoxEUGSIC7tlrmRNcZekViVEhETDfGcmH7jNd1t1L0CEq4s1s9m8Wk/RQ==
// -----END CERTIFICATE REQUEST-----`

var cert = fs.readFileSync('/etc/ssl/cryptokenxchange_com.crt');
var key = fs.readFileSync('/etc/ssl/cryptokenxchange.com.key');


var options = {
  key: key,
  cert: cert
  // ,
  // ca: ca
};
var server = https.createServer(options, app);
//-------------------------------------------------------------------------------------------


// server = require('http').Server(app);
    var io = require('socket.io')(server);
    const dashboardServices = require("./lib/socket/dashboard");

    io.sockets.on('connection', function(socket){
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, browser_id");
  next();
});
        socket.on('updateData', function(){
        io.sockets.emit('orderTrade');
        });
    })
    // set server home directory
    app.locals.rootDir = __dirname;

    // config express
 config.expressConfig(app, config.cfg.environment);

    // attach the routes to the app
    require("./lib/routes")(app);
    //require("./lib/post")(app);



    // start server
    server.listen(config.cfg.port, () => {
        console.log(`Express server listening on ${config.cfg.port}, in ${config.cfg.TAG} mode`);
    });

});
