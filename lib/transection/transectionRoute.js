const trnsRoute = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const transectionServices = require("./transectionServices")



trnsRoute.route("/getBalance")
    .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        transectionServices.getBalance(req,res);
    });
trnsRoute.route("/sendBalance")
    .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        transectionServices.sendBalance(req,res);
    });



module.exports = trnsRoute;
