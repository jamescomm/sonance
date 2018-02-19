const admRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const adminServices = require("./adminServices");


admRoutr.route("/signupSwitch")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.signupSwitch(req, res);
    });
admRoutr.route("/switch")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.switch(req, res);
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
admRoutr.route("/tradeSwitchOn")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.tradeSwitchOn(req, res);
    }); 
admRoutr.route("/tradeSwitchOff")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.tradeSwitchOff(req, res);
    });
admRoutr.route("/usercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.usercount(req, res);
    });

    // active user count 
    admRoutr.route("/activeusercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        adminServices.activeusercount(req, res);
    });
        // deactive user count 
    admRoutr.route("/deactiveusercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.deactiveusercount(req, res);
    });
    // block user count 
    admRoutr.route("/blockusercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.blockusercount(req, res);
    });
    // kyc user count 
    admRoutr.route("/kycusercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.kycusercount(req, res);
    });
    // pending kyc user count 
    admRoutr.route("/pkycusercount")//http://localhost:4009/exchanges/api/v1/admin/pkyckusercount
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.pkycusercount(req, res);
    });
    // active kyc user count 
    admRoutr.route("/akycusercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.akycusercount(req, res);
    });
    // active kyc user count 
    admRoutr.route("/rkycusercount")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.rkycusercount(req, res);
    });
    admRoutr.route("/changeUserState")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.changeUserState(req, res);
    });
    admRoutr.route("/updateFee")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.updateFee(req, res);
    });
    admRoutr.route("/subadmin")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
    adminServices.subadmin(req, res);
    });
module.exports = admRoutr;