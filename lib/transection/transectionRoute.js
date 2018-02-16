const trnsRoute = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const transectionServices = require("./transectionServices")
const gatewayService = require("../paymentGateway")


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

trnsRoute.route("/getXrp")
    .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        transectionServices.getXrp(req,res);
    });
trnsRoute.route("/paynow")
    .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        gatewayService.paynow(req,res);
    });
trnsRoute.route("/success")
    .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        gatewayService.success(req,res);
    });
trnsRoute.route("/cancel")
    .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        gatewayService.cancel(req,res);
    });
module.exports = trnsRoute;
