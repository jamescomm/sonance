// *********************requiring necessary modules******************
const bitcoin = require('bitcoin');
const client = new bitcoin.Client({
    host: '162.213.252.66',
    port: 18336,
    user: 'test',
    pass: 'test123'
});
const Constants = require('./transectionConstants');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require('../global/Responder');
const currencyData = require('../address/currencyData');

//****************************required functions************************ 
function errorOnSever(req, res, err) {
    if (err.code && err.code == "ECONNREFUSED")
        return resHndlr.apiResponder(req, res, "BTC Server Refuse to connect app, please try again in some time.", 500, err)
    else if (err.code && err.code == -5)
        return resHndlr.apiResponder(req, res, "Invalid address.", 500, err)
    else if (err.code && err.code == -6)
        return resHndlr.apiResponder(req, res, "Account has Insufficient funds.", 500, err)
    else if (err.code && err.code < 0)
        return resHndlr.apiResponder(req, res, "Problem in BTC server in getting your balance, please try after some time.", 500, err)
    else
        return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500, err)

}

//*******************************API's********************************
module.exports = {
    'getBalance': (req, res) => {
        let currencyValue = currencyData.currencyData[req.body.currency]
        console.log("currencyValue: ", currencyValue, req.body.user_id)
        globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err)
                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else {
                var labelWithPrefix = 'LABELPREFIX' + response._id;
                client.cmd('getBalance', labelWithPrefix, (err, balanceOnServer, resHeader) => {
                    if (err)
                        errorOnSever(req, res, err);
                    else {
                        console.log("balanceOnServer : ", balanceOnServer)
                        let currencyDetailsInDb = response.currencies.find(function(element) {
                            return element.currency == currencyValue.currency;
                        });
                        console.log("currencyDetailsInDb :  ", currencyDetailsInDb);
                        let updatedBalance = currencyDetailsInDb.balance + balanceOnServer;
                        console.log("updatedBalance :  ", updatedBalance);
                        client.cmd('move', labelWithPrefix, currencyValue.COMPANYACCOUNT, balanceOnServer, (err, UpdatedServer, resHeader) => {
                            if (err)
                                errorOnSever(req, res, err);
                            else if (UpdatedServer) {
                                globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                                    if (err)
                                        return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                                    else
                                        return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
                                })
                            }
                        })
                    }

                })
            }
        })
    },
    'sendBalance': (req, res) => {
        let currencyValue = currencyData.currencyData[req.body.currency]
        console.log("currencyValue: ", currencyValue, req.body.user_id)
        globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err)
                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else
                globalFunction.isAddressExsist(response._id, currencyValue.currency, function(err, result) {
                    if (err)
                        return resHndlr.apiResponder(req, res, err, 500, err)
                    else if (result) {
                        if (req.body.balance < result.balance) {
                            let sendAmount = parseFloat((parseFloat(req.body.balance) - parseFloat(currencyValue.transectionCharge)));
                            client.cmd('sendfrom', currencyValue.COMPANYACCOUNT, req.body.address, sendAmount, 1, req.body.address, req.body.address, (err, TransactionDetails, resHeaders) => {
                                if (err)
                                    errorOnSever(req, res, err);
                                else if (TransactionDetails) {
                                	console.log("TransactionDetails: ",TransactionDetails);
                                    let updatedBalance = parseFloat((parseFloat(result.balance) - parseFloat(req.body.balance)));
                                    globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                                        if (err)
                                            return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                                        else
                                            return resHndlr.apiResponder(req, res, "Successfully completed your transection.", 200, result);
                                    })
                                } else 
                                    return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500)
                            })
                        } else 
                            return resHndlr.apiResponder(req, res, "You don't have sufficient balance to proceed this transection.", 500)
                    } else if (!err && !result)
                        return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500)
                })
        })
    }



}