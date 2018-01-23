const exchngRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const exchangeServices = require("./exchangeServices")


exchngRoutr.route("/exchange")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        exchangeServices.exchange(req, res)
    });




module.exports = exchngRoutr;