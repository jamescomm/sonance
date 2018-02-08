const admRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const adminServices = require("./adminServices");


admRoutr.route("/signupSwitch")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.signupSwitch(req, res);
    });
admRoutr.route("/exchangeSwitch")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.exchangeSwitch(req, res);
    });
admRoutr.route("/withdrawSwitchOff")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.withdrawSwitchOff(req, res);
    });
admRoutr.route("/withdrawSwitchOn")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.withdrawSwitchOn(req, res);
    });   
module.exports = admRoutr;