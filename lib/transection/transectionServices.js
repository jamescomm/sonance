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
const Transaction = require('./transections');
const RuleBook = require('../admin/ruleBook');
var BigNumber = require('bignumber.js');

//****************************required functions************************ 
function bitGetBalance(req,res,response,currencyValue,labelWithPrefix)
{
    console.log("labelWithPrefix: ",labelWithPrefix)
    client.cmd('getbalance', labelWithPrefix, (err, balanceOnServer, resHeader) => {
    console.log("err,balanceOnServer,resHeader :  ",err , "------", balanceOnServer,"------",resHeader)
    if (err)
        errorOnSever(req, res, err);
    else if(balanceOnServer){
        console.log("balanceOnServer : ", balanceOnServer)
        let currencyDetailsInDb = response.balance.currencies.find(function(element) {
            return element.currency == currencyValue.currency;
        });
         if(currencyDetailsInDb)
        {
        console.log("currencyDetailsInDb :  ", currencyDetailsInDb);
        let updatedBalance = BigNumber(currencyDetailsInDb.balance).plus(balanceOnServer);
        console.log("updatedBalance :  ", updatedBalance = parseFloat(updatedBalance));
        client.cmd('move', labelWithPrefix, currencyValue.COMPANYACCOUNT, balanceOnServer, (err, UpdatedServer, resHeader) => {
            console.log("in move function:  ",err,">>>>>>",UpdatedServer)
            if (err)
                errorOnSever(req, res, err);
            else if (UpdatedServer) {
                globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                    if (err)
                        return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                    else
                        return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
                    // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,false);
                })
            }
        })
    }
    else
        return resHndlr.apiResponder(req, res, "Sorry, you don't have this currency access yet.Please visit this currency page first", 500, err);
    }
    else
       return resHndlr.apiResponder(req, res, "No funds to update", 500, err); 

})
}
function ethGetBalance(req,res,response,currencyValue)
{
    web3.eth.getBalance(req.body.address,(err,balanceOnServer)=>{
    console.log("err,balanceOnServer,resHeader :  ",err , "------", balanceOnServer)
    if (err)
        errorOnSever(req, res, err);
    else if(balanceOnServer){
        console.log("balanceOnServer : ", balanceOnServer)
        let currencyDetailsInDb = response.balance.currencies.find(function(element) {
            return element.currency == currencyValue.currency;
        });
         if(currencyDetailsInDb)
        {
        console.log("currencyDetailsInDb :  ", currencyDetailsInDb);
        let updatedBalance = BigNumber(currencyDetailsInDb.balance).plus(balanceOnServer);
        console.log("updatedBalance :  ", updatedBalance = parseFloat(updatedBalance));
        web3.personal.signAndSendTransaction({'to': currencyValue.COMPANYACCOUNT, 'from': req.body.address ,'value': balanceOnServer}, req.body._id,(err, UpdatedServer)=>{
            console.log("in move function:  ",err,">>>>>>",UpdatedServer)
            if (err)
                errorOnSever(req, res, err);
            else if (UpdatedServer) {
                globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                    if (err)
                        return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                    else
                        return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
                    // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,false);
                })
            }
        })
    }
    else
        return resHndlr.apiResponder(req, res, "Sorry, you don't have this currency access yet.Please visit this currency page first", 500, err);
    }
    else
       return resHndlr.apiResponder(req, res, "No funds to update", 500, err); 

})
}
function bitSendBalance(req,res,currencyValue,sendAmount,result)
{
    console.log("sendAmount::  ",typeof sendAmount , sendAmount)
            client.cmd('sendfrom', 'EXbitwireBCH@gmail.com', req.body.address, parseFloat(sendAmount), 1,
                             req.body.address, req.body.address, (err, TransactionDetails, resHeaders) => {
                                if (err)
                                    {console.log("err:   ",err)
                                    errorOnSever(req, res, err);
                                }
                                else if (TransactionDetails) {
                                    console.log("TransactionDetails: ",TransactionDetails);
                                    let updatedBalance = parseFloat(BigNumber(result.balance).minus(req.body.balance));
                                    globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                                        if (err)
                                            return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                                        else
                                            return resHndlr.apiResponder(req, res, "Successfully completed your transection.", 200, result);
                                        // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,true);
                                    })
                                } else 
                                    return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500)
                            })
}
function ethSendBalance(req,res,currencyValue,sendAmount)
{
    web3.personal.signAndSendTransaction({'to': currencyValue.COMPANYACCOUNT,
     'from': req.body.address ,'value': sendAmount}, req.body._id,(err, TransactionDetails)=>{
                                if (err)
                                    errorOnSever(req, res, err);
                                else if (TransactionDetails) {
                                    console.log("TransactionDetails: ",TransactionDetails);
                                    let updatedBalance = parseFloat(BigNumber(result.balance).minus(req.body.balance));
                                    globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                                        if (err)
                                            return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                                        else
                                            return resHndlr.apiResponder(req, res, "Successfully completed your transection.", 200, result);
                                        // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,true);
                                    })
                                } else 
                                    return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500)
                            })
}
function transaction(req,res,user_id,transaction_id,amount,withdraw)
{
    Transaction.create({user_id:user_id,transaction_id:transaction_id,amount:amount,withdraw:withdraw})
    .then((success)=>{
        if(success)
        return resHndlr.apiResponder(req, res, "Successfully completed your transection.", 200, success);
    else
        return resHndlr.apiResponder(req, res, "Something went wrong please try after some time.", 403);
    })
    .catch((unsuccess)=>{return resHndlr.apiResponder(req, res, "Something went wrong please try after some time.", 403)})
}
function errorOnSever(req, res, err) {
    if (err.code && err.code == "ECONNREFUSED")
        return resHndlr.apiResponder(req, res, "Server Refuse to connect app, please try again in some time.", 500, err)
    else if (err.code && err.code == -5)
        return resHndlr.apiResponder(req, res, "Invalid address.", 500, err)
    else if (err.code && err.code == -6)
        return resHndlr.apiResponder(req, res, "Account has Insufficient funds.", 500, err)
    else if (err.code && err.code < 0)
        return resHndlr.apiResponder(req, res, "Problem in server in getting your balance, please try after some time.", 500, err)
    else
        return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500, err)

}

//*******************************API's********************************
module.exports = {
       'getXrp': (req, res) => {
        if (!req.body.user_id || !req.body.address || !req.body.destinationTag || !req.body.amount) resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
        else globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err) return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else {
                globalFunction.isAddressExsist(response._id, 'XRP', function(err, result) {
                    if (err) return resHndlr.apiResponder(req, res, err, 500, err)
                    else if (result) {
                        const RippleAPI = require('ripple-lib').RippleAPI;
                        const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
                        // const instructions = { maxLedgerVersionOffset: 5};
                        console.log("req.body.address",req.body.address)
// {"Flags":2147483648,"TransactionType":"AccountSet","Account":"r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
// "Domain":"726970706C652E636F6D","LastLedgerSequence":8820051,"Fee":"12","Sequence":23};
                        const payment = {
                            source: {
                                address: req.body.address, //from
                                maxAmount: {
                                    value: "10",
                                    currency: 'XRP'
                                }
                            },
                            destination: {
                                address: 'rK59fS2Ua5YpYhk4CU2v9P52Rw17kZo43o', //to address
                                amount: {
                                    value: "10",
                                    currency: 'XRP'
                                }
                            }
                        };

                        function quit(message) {
                            console.log(message);
                            oldBalance = result.balance;
                            updatedBalance = BigNumber(oldBalance).plus(req.body.amount);
                            updatedBalance = parseFloat(updatedBalance);
                             globalFunction.updateBalanceInDb(req.body.user_id,'XRP', updatedBalance, (err, result) => {
                                        if (err)
                                            return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                                        else
                                        {
                                            if (options.earliestFirst) {
                                                maxLedgerVersion = _.last(transactions).outcome.ledgerVersion;
                                              } else {
                                                minLedgerVersion = _.last(transactions).outcome.ledgerVersion;
                                              }
                                              Objectss = {maxLedgerVersion:maxLedgerVersion,minLedgerVersion:minLedgerVersion}
                                            const address = 'rK59fS2Ua5YpYhk4CU2v9P52Rw17kZo43o';
                                            //  api.getTransactions(address,Objects).then(info =>
                                            //   {console.log("info: ",info);
                                            //   transaction(req,res,req.body.user_id,message,req.body.amount,true);})
                                            // .catch((unsuccess)=>console.log("unsuccess: ",unsuccess))
                                    }
                                    })
                        }

                        function fail(message) {
                            console.log("message:   ",message)
                            return resHndlr.apiResponder(req, res, message, 500)
                        }
                        api.connect().then(() => {
                            console.log('Connected...');
                            return api.preparePayment(req.body.address, payment).then(prepared => {
                                console.log('Payment transaction prepared...');
                                const {
                                    signedTransaction
                                } = api.sign(prepared.txJSON, 'sapCBdAYsi4gZZ2LcbzVrXc7wfdfA');
                                console.log('Payment transaction signed...');
                                api.submit(signedTransaction).then(quit, fail);
                            });
                        }).catch(fail);
                    } else {
                        return resHndlr.apiResponder(req, res, "You do not have XRP address, first generate XRP address by visiting XRP currency page.", 500, err)
                    }
                })
            }
        })
    },
    'getBalance': (req, res) => {
        req.body.currency = req.body.currency.toUpperCase();
        let currencyValue = currencyData.currencyData[req.body.currency]
        console.log("currencyValue: ", currencyValue, req.body.user_id)
        globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err)
                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else {
                console.log("response._id :::  ",response._id)
                var labelWithPrefix = 'LABELPREFIX' + response._id;
                 if(req.body.currency == "ETH")
                            {
                                console.log("ETH")
                            return ethGetBalance(req,res,response,currencyValue);
                            }
                            else
                            {
                            return bitGetBalance(req,res,response,currencyValue,labelWithPrefix);
                            }
            }
        })
    },
    'sendBalance': (req, res) => {
        req.body.currency = req.body.currency.toUpperCase()
        let currencyValue = currencyData.currencyData[req.body.currency]
        console.log("currencyValue: ", currencyValue, req.body.user_id)
        RuleBook.findOne()
        .then((success)=>{
            if(success)
            {console.log("success:   ",success)
                if(success.withdraw.indexOf(req.body.currency)<0)
            globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err)
                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else
                globalFunction.isAddressExsist(response._id, currencyValue.currency, function(err, result) {
                    if (err)
                        return resHndlr.apiResponder(req, res, err, 500, err)
                    else if (result) {
                        if (req.body.balance < result.balance) {
                            let sendAmount = parseFloat(BigNumber(req.body.balance).multipliedBy(currencyValue.transectionCharge));
                             sendAmount = parseFloat(BigNumber(req.body.balance).minus(sendAmount))
                            if(req.body.currency == "ETH")
                            {
                                console.log("ETH")
                                return ethSendBalance(req,res,currencyValue,sendAmount);
                            }
                            else
                            {
                            return bitSendBalance(req,res,currencyValue,sendAmount,result);
                            }
                        } else 
                            return resHndlr.apiResponder(req, res, "You don't have sufficient balance to proceed this transection.", 500)
                    } else if (!err && !result)
                        return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500)
                })
        })
        else
            return resHndlr.apiResponder(req, res, "Withdraw for this currency is stop for sometime, will notify when we will be able to surve you.", 500);
            }
            else
               return resHndlr.apiResponder(req, res, "We are in maintinance mode.", 500); 
        })
        .catch((unsuccess)=>{
           return resHndlr.apiResponder(req, res, "Something went wrong", 500, err) 
        })
    },
    'walletNotify':(req,res)=>{
        console.log("yes we did it:  ",req.query);
    }



}