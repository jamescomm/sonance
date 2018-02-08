const Constants = require('./exchangeConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require("../global/Responder");
const Exchanges = require("./exchangeFunctions");
const RuleBook = require("../admin/ruleBook");
const NodeCache = require("node-cache");
const myCache = new NodeCache();
//*********************** required functions ***********************
//  myCache.del("5a682ba43fd2fa19ddfe3ded", function(err, count) {
//     if (!err) console.log(count);
// });
//****************************** API *******************************
module.exports = {
    "exchange": (req, res) => {
        if (!req.body.amount || !req.body.amount.currency || !req.body.rate || !req.body.volume || 
            !req.body.volume.currency || !req.body.user_id || !req.body.type || !req.body.amount.value || !req.body.volume.value) {
            resHndlr.apiResponder(req, res, 'Please fill the required fields.', 400)
        } else {
            RuleBook.findOne()
        .then((success)=>{
            if(success)
            {
                console.log("success:   ",success)
                if(success.trade.indexOf(req.body.amount.currency)<0 && success.trade.indexOf(req.body.volume.currency)<0)
                {
            globalFunction.isUserExsist(req.body.user_id, (err, User) => {
                if (err) return resHndlr.apiResponder(req, res, "Something went wrong1", 500, err)
                else if (User) {
                    if (req.body.type == "ask" || req.body.type == "ASK") 
                        var currencyCheck = req.body.volume.currency;
                    else var currencyCheck = req.body.amount.currency;
                    globalFunction.isAddressExsist(User._id, currencyCheck, function(err, result) {
                        if (err) return resHndlr.apiResponder(req, res, err, 500, err)
                        else if (result) {
                            if (req.body.type == "ask" || req.body.type == "ASK") {
                                myCache.get(req.body.user_id, function(err, value) {
                                    if (!err) {
                                        if (value == undefined) {
                                            console.log("in undefined");
                                            myCache.set(req.body.user_id, req.body.user_id, function(err, successed) {
                                                if (!err && successed) {
                                                    Exchanges.exchangeAsk(req.body, User, result, (err, success, message) => {
                                                        myCache.del(req.body.user_id, function(err, count) {
                                                            if (!err) console.log(count);
                                                        });
                                                        if (err)
                                                        { 
                                                            console.log("errrrrr",err)
                                                            return resHndlr.apiResponder(req, res, "Something went wrong...", 500, err)
                                                        }
                                                        else return resHndlr.apiResponder(req, res, message, 200, err)
                                                    })
                                                } else console.log("wrong:::::::::::")
                                            })
                                        } else if (value) {
                                            return resHndlr.apiResponder(req, res, "Request is in process", 500, err)
                                        }
                                    } else return resHndlr.apiResponder(req, res, "Something went wrong!!!", 500, err)
                                });
                            } else {
                                myCache.get(req.body.user_id, function(err, value) {
                                    if (!err) {
                                        if (value == undefined) {
                                            myCache.set(req.body.user_id, req.body.user_id, function(err, successed) {
                                                if (!err && successed) {
                                                    Exchanges.exchangeBid(req.body, User, result, (err, success, message) => {
                                                        myCache.del(req.body.user_id, function(err, count) {
                                                            if (!err) console.log(count);
                                                        });
                                                        if (err)
                                                        { 
                                                            console.log("err::    ",err)
                                                            return resHndlr.apiResponder(req, res, "Something went wrong2", 500, err)
                                                        }
                                                        else return resHndlr.apiResponder(req, res, message, 200, err)
                                                    })
                                                } else console.log("wrong:::::::::::")
                                            })
                                        } else if (value) return resHndlr.apiResponder(req, res, "Request is in process,try in some time.", 500, err)
                                    } else return resHndlr.apiResponder(req, res, "Something went wrong!!!", 500, err)
                                });
                            }
                        } else return resHndlr.apiResponder(req, res, "Sorry, you don't have sufficient balance, please try again later!!", 500, err)
                    })
                } else return resHndlr.apiResponder(req, res, "Sorry, we are not able to identify your identity, please login again!!", 500, err)
            })
                }
                else
                    return resHndlr.apiResponder(req, res, "Trading for this market is off for now.", 500)
            }
    })
        .catch((unsuccess)=>{
            console.log("unsuccess:  ",unsuccess)
            return resHndlr.apiResponder(req, res, "Something went wrong", 500,unsuccess)})
        }
    },
    'graph': (req, res) => {
        var BigNumber = require('bignumber.js');
        var data = 0.5;
        data = BigNumber(data)
        console.log(data);
        console.log(parseFloat(data))
    }
}