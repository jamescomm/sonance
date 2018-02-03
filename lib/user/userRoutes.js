const usrRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const userServices = require("./userServices");
const constants = require("../constants");
const userConstants = require("./userConstants");
const jwtHandler = require("../jwtHandler");
const addressServices = require("../address/addressServices")
// const appUtil = require("../appUtils");
//const mediaUpload = require("../mediaupload/mediaUploadmiddleware");
// const validators=require("./userValidators");


usrRoutr.route("/createUser")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.createUser(req, res)
            .then(function(result) {
                userServices.userCurrency(result._id)
                    .then((successfully) => resHndlr.apiResponder(req, res, 'User signup successfully.', 200, result))
            }).catch(function(err) {
                if (err.code)
                    var message = userConstants.MESSAGES.EmailAlreadyExsist
                else
                    var message = userConstants.MESSAGES.SomeThingWrong
                resHndlr.apiResponder(req, res, message, 500)
            })

    });


usrRoutr.route("/userTradeMarket")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userTradeMarket(req, res);
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
module.exports = usrRoutr;