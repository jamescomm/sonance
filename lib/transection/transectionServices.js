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


//****************************required functions************************ 
function transaction(req,res,user_id,transaction_id,amount,withdraw)
{
    Transaction.insert({user_id:user_id,transaction_id:transaction_id,amount:amount,withdraw:withdraw})
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
    'getBalance': (req, res) => {
        let currencyValue = currencyData.currencyData[req.body.currency]
        console.log("currencyValue: ", currencyValue, req.body.user_id)
        globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err)
                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else {
                console.log("response._id :::  ",response._id)
                var labelWithPrefix = 'LABELPREFIX' + response._id;
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
                        let updatedBalance = currencyDetailsInDb.balance + balanceOnServer;
                        console.log("updatedBalance :  ", updatedBalance);
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
        })
    },
    'sendBalance': (req, res) => {
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
                                            // return resHndlr.apiResponder(req, res, "Successfully completed your transection.", 200, result);
                                        transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,true);
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
        else
            return resHndlr.apiResponder(req, res, "Withdraw for this currency is stop for sometime, we will notify when we able to surve you.", 500);
            }
            else
               return resHndlr.apiResponder(req, res, "With are in maintinance mode.", 500); 
        })
        .catch((unsuccess)=>{
           return resHndlr.apiResponder(req, res, "Something went wrong", 500, err) 
        })
    },
    'walletNotify':(req,res)=>{
        console.log("yes we did it:  ",req.query);
    }



}