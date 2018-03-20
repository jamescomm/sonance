console.log("");
console.log("//************************* Welcome to exchangess **************************//");
console.log("");


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
console.log("allow ori............gin");  
res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, browser_id");
  next();
});
server = require('http').Server(app);
    var io = require('socket.io')(server);
    const dashboardServices = require("./lib/socket/dashboard");

    io.sockets.on('connection', function(socket){
app.use(function(req, res, next) {
console.log("allow origin.........");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, browser_id");
  next();
});
        console.log("1 socket")
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
