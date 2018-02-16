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
exchngRoutr.route("/graph")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        exchangeServices.graph(req, res)
    });
exchngRoutr.route("/cancelBid")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        exchangeServices.cancelBid(req, res)
    });
exchngRoutr.route("/cancelAsk")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        exchangeServices.cancelAsk(req, res)
    });
module.exports = exchngRoutr;