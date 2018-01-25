const Constants = require('./exchangeConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require("../global/Responder");
const Exchanges = require("./exchangeFunctions");
//*********************** required functions ***********************




//****************************** API *******************************
module.exports = {
    "exchange": (req, res) => {
        if (!req.body.amount.value || !req.body.amount.currency || !req.body.rate || !req.body.volume.value ||
            !req.body.volume.currency || !req.body.user_id || !req.body.type) {
            resHndlr.apiResponder(req, res, 'Please fill the required fields.', 400)
        } else {
            globalFunction.isUserExsist(req.body.user_id, (err, User) => {
                if (err)
                    return resHndlr.apiResponder(req, res, "Something went wrong1", 500, err)
                else if (User) {
                    if (req.body.type == "ask" || req.body.type == "ASK")
                        var currencyCheck = req.body.volume.currency;
                        else
                        var currencyCheck = req.body.amount.currency;
                    globalFunction.isAddressExsist(User._id, currencyCheck, function(err, result) {
                        if (err)
                            return resHndlr.apiResponder(req, res, err, 500, err)
                        else if (result) {
                            if (req.body.type == "ask" || req.body.type == "ASK")
                                Exchanges.exchangeAsk(req.body, User, result, (err, success) => {
                                     if(err)
                                     {console.log("err:  ",err)
                                        return resHndlr.apiResponder(req,res,"Something went wrong2",500,err)
                                    }
                                    else
                                        return resHndlr.apiResponder(req,res,"Your bid placed successfully.",200,err)
                                })
                            else
                                Exchanges.exchangeBid(req.body, User, result, (err, success) => {
                                    if(err)
                                        return resHndlr.apiResponder(req,res,"Something went wrong2",500,err)
                                    else
                                        return resHndlr.apiResponder(req,res,"Your bid placed successfully.",200,err)
                                })
                        } else
                            return resHndlr.apiResponder(req, res, "Sorry, you don't have sufficient balance, please try again later!!", 500, err)
                    })
                } else
                    return resHndlr.apiResponder(req, res, "Sorry, we are not able to identify your identity, please login again!!", 500, err)
            })
        }
    }
}