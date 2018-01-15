console.log("");
console.log("//************************* Welcome to exchanges **************************//");
console.log("");


    //import env 
    require('dotenv').config()
    
    //Import Config
    const config = require('./lib/config');
    

    //connect to db
    config.dbConfig(config.cfg, (err) => {
        if (err) {
            console.log(err, 'exiting the app.');
            return;
        }

    // load external modules
    const express = require("express");

    // init express app
    const app = express();

    // set server home directory
    app.locals.rootDir = __dirname;

    // config express
    config.expressConfig(app, config.cfg.environment);

    // start server
    app.listen(config.cfg.port, () => {
        console.log(`Express server listening on ${config.cfg.port}, in ${config.cfg.TAG} mode`);
    });

});
