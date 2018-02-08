const usrRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const userServices = require("./userServices");
const constants = require("../constants");
const userConstants = require("./userConstants");
const jwtHandler = require("../jwtHandler");
const addressServices = require("../address/addressServices")
const kycServices = require('./kycServices');
// const appUtil = require("../appUtils");
//const mediaUpload = require("../mediaupload/mediaUploadmiddleware");
// const validators=require("./userValidators");


usrRoutr.route("/createUser")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.createUser(req, res);
    });
usrRoutr.route("/userTradeMarket")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userTradeMarket(req, res);
    });
usrRoutr.route("/login")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.login(req, res);
    });
usrRoutr.route("/forgetPassword")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.forgetPassword(req, res);
    });
usrRoutr.route("/userTrades")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userTrades(req, res);
    });
usrRoutr.route("/userBalance")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userBalance(req, res);
    });
usrRoutr.route("/userCurrencyBalance")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userCurrencyBalance(req, res);
    });
usrRoutr.route("/userList")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userList(req, res);
    });
usrRoutr.route("/addVerificationDetails")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        kycServices.addVerificationDetails(req, res);
    });
usrRoutr.route("/imageUploadAddress")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        kycServices.imageUploadAddress(req, res);
    });
usrRoutr.route("/imageUploadTax")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        kycServices.imageUploadTax(req, res);
    });
usrRoutr.route("/getVerificationDetails")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        kycServices.getVerificationDetails(req, res);
    });
usrRoutr.route("/updateKYCformStatusByUserId")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        kycServices.updateKYCformStatusByUserId(req, res);
    });
module.exports = usrRoutr;