const exchngRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const exchangeServices = require("./exchangeServices")


exchngRoutr.route("/exchange")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        exchangeServices.exchange(req, res)
         // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
exchngRoutr.route("/graph")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        exchangeServices.graph(req, res)
    });
exchngRoutr.route("/cancelBid")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        exchangeServices.cancelBid(req, res)
         // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
exchngRoutr.route("/cancelAsk")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        exchangeServices.cancelAsk(req, res)
         // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
module.exports = exchngRoutr;