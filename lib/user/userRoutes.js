const usrRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const userServices = require("./userServices");
const dashboardServices = require("../socket/dashboard");
const constants = require("../constants");
const userConstants = require("./userConstants");
const jwtHandler = require("../jwtHandler");
const addressServices = require("../address/addressServices")
const ticketServices = require("../admin/ticketServices")
const kycServices = require('./kycServices')
// const appUtil = require("../appUtils");
//const mediaUpload = require("../mediaupload/mediaUploadmiddleware");
// const validators=require("./userValidators");



console.log("1111111111")

usrRoutr.route("/graph")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        console.log("hi")
        dashboardServices.graph(req,function(err,result)
            {
                if(err)
                    resHndlr.apiResponder(req, res, 'Something went wrong', 400,err)
                else
                    return res.send(result);
            });
    });




usrRoutr.route("/createUser")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.createUser(req, res);
    });

usrRoutr.route("/userTradeMarket")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.userTradeMarket(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/transactionPassword")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.transactionPassword(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/verifyTransactionPassword")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.verifyTransactionPassword(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/removeTransactionPassword")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.removeTransactionPassword(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/twoFactor")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.twoFactor(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/phoneFactor")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.phoneFactor(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/login")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.login(req, res);
    });
usrRoutr.route("/forgetPassword")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.forgetPassword(req, res);
    });
usrRoutr.route("/userProfile")
    .get([ middleware.authenticate.autntctTkn ], function(req, res) {
        userServices.userProfile(req, res);
    });
usrRoutr.route("/userTrades")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        userServices.userTrades(req, res);
    });
usrRoutr.route("/userOrders")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        userServices.userOrders(req, res);
    });
usrRoutr.route("/trades")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.trades(req, res);
    });
usrRoutr.route("/changePassword")
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        userServices.changePassword(req, res);
    });
usrRoutr.route("/userBalance")
    .get([ middleware.authenticate.autntctTkn ], function(req, res) {
         // if(req.user._id == req.body.user_id)
         console.log("1111111",req.query)
        userServices.userBalance(req, res);
        // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/userCurrencyBalance")
    .get([ middleware.authenticate.autntctTkn ], function(req, res) {
        // if(req.user._id == req.body.user_id)
        userServices.userCurrencyBalance(req, res);
    // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/userList")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.userList(req, res);
    });
usrRoutr.route("/subadminList")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.subadminList(req, res);
    });
usrRoutr.route("/sendOtp")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.sendOtp(req, res);
    });
usrRoutr.route("/verifyOtp")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
         // if(req.user._id == req.body.user_id)
        userServices.verifyOtp(req, res);
         // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
usrRoutr.route("/verifyEmail")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.verifyEmail(req, res);
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
    .post([ middleware.authenticate.autntctTkn ], function(req, res) {
        kycServices.updateKYCformStatusByUserId(req, res);
    });
usrRoutr.route("/generateTicket")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        ticketServices.generateTicket(req, res);
    });
usrRoutr.route("/orderTrade")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        console.log("hi")
        dashboardServices.orderTrade(req,function(err,result)
            {
                if(err)
                    resHndlr.apiResponder(req, res, 'Something went wrong', 400,err)
                else
                    resHndlr.apiResponder(req, res, 'Done...', 200,result)
            });
    });
usrRoutr.route("/orderBidPercentage")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        console.log("hi")
        dashboardServices.orderBidPercentage(function(err,result)
            {
                if(err)
                    resHndlr.apiResponder(req, res, 'Something went wrong', 400,err)
                else
                    resHndlr.apiResponder(req, res, 'Done...', 200,result)
            });
    });
usrRoutr.route("/marketInfo")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        console.log("hi")
        dashboardServices.marketInfo(req,function(err,result)
            {
                if(err)
                    resHndlr.apiResponder(req, res, 'Something went wrong', 400,err)
                else
                    resHndlr.apiResponder(req, res, 'Done...', 200,result)
            });
    });
usrRoutr.route("/quantityBarBid")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        console.log("hi")
        dashboardServices.quantityBarBid(req,function(err,result)
            {
                if(err)
                    resHndlr.apiResponder(req, res, 'Something went wrong', 400,err)
                else
                    resHndlr.apiResponder(req, res, 'Done...', 200,result)
            });
    });
usrRoutr.route("/quantityBarAsk")
    .get([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        console.log("hi")
        dashboardServices.quantityBarAsk(req,function(err,result)
            {
                if(err)
                    resHndlr.apiResponder(req, res, 'Something went wrong', 400,err)
                else
                    resHndlr.apiResponder(req, res, 'Done...', 200,result)
            });
    });
module.exports = usrRoutr;
