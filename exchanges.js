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
// var fs = require('fs')
// var cert = fs.readFileSync('/etc/ssl/cryptokenxchange_com.crt');
// var key = fs.readFileSync('/etc/ssl/cryptokenxchange.com.key');
// var ca = fs.readFileSync('/etc/ssl/cryptokenxchange_com.ca-bundle');

// var options = {
//   key: key,
//   cert: cert
//    ,
//    ca: ca
// };
// var server = https.createServer(options, app);
//-------------------------------------------------------------------------------------------


server = require('http').Server(app);


//------------------------------------------------------------------------------------------
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
