// *********************requiring necessary modules******************
const bitcoin = require('bitcoin');
const client = new bitcoin.Client({
  host: '192.64.116.199',
  port: 18332,
  user: 'test',
  pass: 'test123'
});
const Constants = require('./transectionConstants');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require('../global/Responder');
const currencyData = require('../address/currencyData');
const Currency = require('../currency/currencies');
const User = require('../user/user');
const Transaction = require('./transections');
const RuleBook = require('../admin/ruleBook');
var BigNumber = require('bignumber.js');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var Web3 = require('web3');
var accounts = new Accounts('http://199.188.204.100:8545');
var personal = new Personal('http://199.188.204.100:8545');
var web3 = new Web3(new Web3.providers.HttpProvider('http://199.188.204.100:8545'));
const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
const Market = require('../address/market');
const Async = require("async");
// const api = new RippleAPI('http://192.168.0.130:5005');
//****************************required functions************************ 
function bitGetBalance(req,res,response,currencyValue,labelWithPrefix)
{
 const Credential = require('../config/env/credentials');
Credential.findOne({})
        .then((credential)=>{
            console.log("cred::",credential, req.body.currency == "PowerCoin")
            credential = credential[req.body.currency];

            index = Math.ceil(req.body.identity/1000);
            console.log(credential, typeof req.body.currency)
            if(credential[index-1])
            var client = new bitcoin.Client({
              host: credential[index-1].host,
              port: credential[index-1].port,
              user: credential[index-1].user,
              pass: credential[index-1].pass
            });
        else
            return resHndlr.apiResponder(req,res,'Sorry not able to generate your addresses,due to heavy server load.',500)
    
    client.cmd('getbalance', labelWithPrefix, (err, balanceOnServer, resHeader) => {
    if (err)
        errorOnSever(req, res, err);
    else if(balanceOnServer){
        let currencyDetailsInDb = response.balance.currencies.find(function(element) {
            return element.currency == currencyValue.currency;
        });
         if(currencyDetailsInDb)
        {
        let updatedBalance = BigNumber(currencyDetailsInDb.balance).plus(balanceOnServer);
        client.cmd('move', labelWithPrefix, currencyValue.COMPANYACCOUNT, balanceOnServer, (err, UpdatedServer, resHeader) => {
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
})
}
function ethGetBalance(req,res,response,currencyValue)
{
//     web3.eth.getBalance(req.body.address,(err,balanceOnServer)=>{
//     if (err)
//     {
//         console.log("error in ethGetBalance::: ",err)
//         errorOnSever(req, res, err);
//     }
//     else if(balanceOnServer){
//         let currencyDetailsInDb = response.balance.currencies.find(function(element) {
//             return element.currency == currencyValue.currency;
//         });
//          if(currencyDetailsInDb)
//         {
//         let updatedBalance = BigNumber(currencyDetailsInDb.balance).plus(balanceOnServer);
//         web3.personal.signAndSendTransaction({'to': currencyValue.COMPANYACCOUNT, 'from': req.body.address ,'value': balanceOnServer},
//          req.body.user_id,(err, UpdatedServer)=>{
//             if (err)
//                 errorOnSever(req, res, err);
//             else if (UpdatedServer) {
//                 globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
//                     if (err)
//                         return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
//                     else
//                         return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
//                     // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,false);
//                 })
//             }
//         })
//     }
//     else
//         return resHndlr.apiResponder(req, res, "Sorry, you don't have this currency access yet.Please visit this currency page first", 500, err);
//     }
//     else
//        return resHndlr.apiResponder(req, res, "No funds to update", 500, err); 

// })

    let fromAddress = req.body.address;
    let toAddress = currencyValue.COMPANYACCOUNT;
    console.log('user address',fromAddress,currencyValue.COMPANYACCOUNT,toAddress);
    if(fromAddress){
          var addresses = web3.eth.getBalance(fromAddress).then((data)=>{
          if(data){
            
            console.log("data:---------------------------",data)
            // data = data-21000*1;
            data = data/1000000000000000000;
            if(data>0)
            {
         console.log("data:----------------------------",data)
            globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, data, (err, result) => {
                if (err)
                    return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                else
                    return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
                })
         //     web3.eth.personal.unlockAccount(fromAddress,req.body.user_id, 15000);
         //    web3.eth.sendTransaction({from: fromAddress, to:toAddress, value: web3.utils.toWei(data.toString(), 'ether'),
         // gasLimit: 21000, gasPrice: 1})
         //   .on('transactionHash', function(hash){
         //    console.log('transactionHash:::::::::'+hash);
         //   globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, data, (err, result) => {
         //            if (err)
         //                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
         //            else
         //                return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
         //            // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,false);
         //        })
         //    })
         //    .on('receipt', function(receipt){
         //        console.log('receipt'+receipt);
         //        globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, data, (err, result) => {
         //            if (err)
         //                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
         //            else
         //                return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
         //            // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,false);
         //        })
         //    })
         //    .on('confirmation', function(confirmationNumber, receipt){ 
         //        console.log('confirmationNumber'+receipt);
         //        globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, data, (err, result) => {
         //            if (err)
         //                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
         //            else
         //                return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
         //            // transaction(req,res,req.body.user_id,TransactionDetails,req.body.balance,false);
         //        })
         //     })
         //    .on('error', function(err){
         //        console.log(err)
         //         return resHndlr.apiResponder(req, res, "No funds to update", 500, err);
         //    });
        }
        else
            return resHndlr.apiResponder(req, res, "No funds to update", 500);
          }
          else{
              return resHndlr.apiResponder(req, res, "No funds to update", 500);
          }
        });
    }
    else{
         return resHndlr.apiResponder(req, res, "Please send user address", 500);
    }
}
function bitSendBalance(req,res,currencyValue,sendAmount,result)
{
const Credential = require('../config/env/credentials');
Credential.findOne({})
        .then((credential)=>{
            console.log("cred::",credential, req.body.currency == "PowerCoin")
            credential = credential[req.body.currency];

            index = Math.ceil(req.body.identity/1000);

            if(credential[index-1])
            var client = new bitcoin.Client({
              host: credential[index-1].host,
              port: credential[index-1].port,
              user: credential[index-1].user,
              pass: credential[index-1].pass
            });
        else
            return resHndlr.apiResponder(req,res,'Sorry not able to generate your addresses,due to heavy server load.',500)

    console.log("sendAmount::  ",typeof sendAmount , sendAmount)
            client.cmd('sendfrom', currencyValue.COMPANYACCOUNT, req.body.address, parseFloat(sendAmount), 1,
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
})
}
function ethSendBalance(req,res,currencyValue,sendAmount)
{
    web3.personal.signAndSendTransaction({'to': req.body.address,
     'from': currencyValue.COMPANYACCOUNT ,'value': sendAmount}, req.body._id,(err, TransactionDetails)=>{
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
        'wallet': (req, res) => {
            let hotWallet = [];
    Market.findOne()
    .then((data) => {
        let XRP = 0;
        let counter = 0;
        let walletData = []
                Currency.aggregate([{$unwind:'$currencies'},{$group:{_id:"$currencies.currency",volume:{$sum:"$currencies.balance"},freezed:{$sum:"$currencies.freezeBalance"}}}])
                .then((success)=>{
                     Async.forEachLimit(success,1,(currencyData,next)=>{
                        var details = Object.assign({}, currencyData);
                        counter++;
                if (currencyData._id == "ETH") {
                    var found = data.currencyData.find((element)=>{return element.currency == currencyData._id});
                    web3.eth.getBalance(found.COMPANYACCOUNT,(err,balanceOnServer)=>{
                        if(err)
                        {
                            details.hot = 0
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                        }
                        else
                        {
                            details.hot = balanceOnServer
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                        }
                    })
                } else if(details._id == "XRP"){                   
                    api.connect().then(() => {
                         console.log("******************in XRP************")
                         setTimeout(() => {
                      if(XRP == 0)
                      {
                        details.hot = 0
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                      }
                      else
                      {
                        console.log("XRP run")
                      }
                    }, 2000);
                    api.getBalances("rHjwG2NmaajpuBbXq9yKPVVJQAa7fTEA8u",function(err,result)
                    { XRP = 1;
                        console.log("111111111111111111")
                        if(err)
                        {
                            details.hot = 0
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                        }
                        else
                        {
                            details.hot = result[0].value
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                        }
                    })
                })
                .catch((unsuccess)=>{
                     details.hot = 0
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                })
                }
                else
                {
                    var found = data.currencyData.find((element)=>{return element.currency == currencyData._id});
                    client.cmd('getbalance', found.COMPANYACCOUNT, (err, balanceOnServer, resHeader) => {
                        if(err)
                        {
                            details.hot = 0
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                        }
                        else
                        {
                            details.hot = balanceOnServer
                            details.cold = 0
                            walletData.push(details)
                            if(counter<success.length)
                                next();
                            else
                                res.json({walletData:walletData})
                        }
                    })
                }
                })
                })
    }).catch((unsuccess) => {
        console.log("unsuccess in  wallet:", unsuccess)
        return resHndlr.apiResponder(req, res, "Something went wrong", 500, unsuccess)
    })
},
       'getXrp': (req, res) => {
        if (!req.body.user_id || !req.body.address || !req.body.amount) resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
        else globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err) return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else {
                globalFunction.isAddressExsist(response._id, 'XRP', function(err, result) {
                    if (err) return resHndlr.apiResponder(req, res, err, 500, err)
                    else if (result) {
                        console.log("req.body.address",req.body.address)
                        const payment = 
                        {
                            source: {address: req.body.address, maxAmount: {value: req.body.amount,currency: 'XRP'}
                            // ,
                            //     tag:""
                            },
                            destination: {
                                address: 'r48Yjyzuj29rc523CYP4hLrjsyAymUxoVb',amount: {value: req.body.amount,currency: 'XRP'}
                                ,
                                tag:req.body.destinationTag
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
                                            return resHndlr.apiResponder(req, res, "Xrp submited.", 200, result)
                                    })
                        }
                        function fail(message) {
                            console.log("message:   ",message)
                            return resHndlr.apiResponder(req, res, message, 500)
                        }
                        api.connect().then(() => {
                            console.log('Connected...');
                            return api.preparePayment(req.body.address, payment).then(prepared => {
                                console.log('Payment transaction prepared...',prepared);
                                const {signedTransaction} = api.sign(prepared.txJSON, 'snce3s3DKNpUVNmHgjxL2YqbRzsKn');
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
    // req.body.currency = req.body.currency.toUpperCase();
    Market.findOne({'currencyData.currency': req.body.currency}, {'currencyData.$': 1})
    .then((data) => {
        let currencyValue = data.currencyData[0]
        // console.log("currencyValue: ", currencyValue, req.body.user_id)
        globalFunction.isUserExsist(req.body.user_id, function(err, response) {
            if (err) return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            else {
                console.log("response._id :::  ", response._id)
                var labelWithPrefix = 'LABELPREFIX' + response._id;
                if (req.body.currency == "ETH") {
                    console.log("ETH")
                    return ethGetBalance(req, res, response, currencyValue);
                } else {
                    return bitGetBalance(req, res, response, currencyValue, labelWithPrefix);
                }
            }
        })
    }).catch((unsuccess) => {
        return resHndlr.apiResponder(req, res, "Something went wrong", 500, unsuccess)
    })
},
    'sendBalance': (req, res) => {
//        req.body.currency = req.body.currency.toUpperCase()
            Market.findOne({'currencyData.currency': req.body.currency}, {'currencyData.$': 1})
            .then((data) => {
        let currencyValue = data.currencyData[0]
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
    })
        .catch((unsuccess)=>{
           return resHndlr.apiResponder(req, res, "Something went wrong", 500, err) 
        })
    },
    'walletNotify':(req,res)=>{
        console.log("yes we did it:  ",req.query);
    },
     'getTransactionsByAccount': (req, res)=>{
    let Address = req.body.Address;

    web3.eth.getBlockNumber().then((blockNo)=>{
        console.log('Block no:::'+blockNo);
        web3.eth.getBlock(blockNo).then((data)=>{
            // res.send({status : 200, data : data});
            console.log('details'+ JSON.stringify(data));

            var addresses = web3.eth.getTransaction(data.hash).then((txdata)=>{
              if(txdata){
                 res.send({status : 200, data : txdata , message : 'Address Balance on Ethrium Node.'});
              }
              else{
                 res.send({status : 200, data : txdata , message : 'No balance Data Found!.'}); 
              }
            });

        });
    })
},
'getTransactionsBit':(req,res)=>{
    if(!req.body.user_id)
        return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
    else
{
 const Credential = require('../config/env/credentials');
Credential.findOne({})
        .then((credential)=>{
            console.log("cred::",credential, req.body.currency == "PowerCoin")
            credential = credential[req.body.currency];

            index = Math.ceil(req.body.identity/1000);

            if(credential[index-1])
            var client = new bitcoin.Client({
              host: credential[index-1].host,
              port: credential[index-1].port,
              user: credential[index-1].user,
              pass: credential[index-1].pass
            });
        else
            return resHndlr.apiResponder(req,res,'Sorry not able to generate your addresses,due to heavy server load.',500)
    var labelWithPrefix = 'LABELPREFIX' + req.body.user_id;
          client.cmd('listtransactions',labelWithPrefix,function(err, transactionList) {
          if (err) {
            if (err.code && err.code == "ECONNREFUSED") {
              return res.json({
                "message": "Server Refuse to connect App",
                statusCode: 400
              });
            }
            if (err.code && err.code < 0) {
              return res.json({
                "message": "Problem in server",
                statusCode: 400
              });
            }
            return res.json({
              "message": "Error in Server",
              statusCode: 400
            });
          }
          console.log("Return transactionList List !! ");
          return res.json({
            "tx": transactionList,
            statusCode: 200
          });
        });
});
      }
},
'getXrpTransactions': (req, res) => {
    const address = 'rBti4EHbmMya6ppkX8dW2UqnEHjDBJ4wLJ';
    globalFunction.isAddressExsist(req.body.user_id, 'XRP', (err, data) => {
        if (data) {
            api.connect().then(() => {
                return api.getTransactions(address, {minLedgerVersion: parseInt(data.lastLedgerVersion)})
                .then(orders => {
                    let result = orders.filter(word => {
                        return ((word.specification.destination.tag == data.address) && (word.outcome.ledgerVersion > (parseInt(data.lastLedgerVersion))))
                    });
                    if (result) {
                        let i = 0;
                        let sum = 0;
                        for (i; i < result.length; i++) {
                            sum = parseFloat(BigNumber(result[i].outcome.deliveredAmount.value).plus(sum));
                        }
                        if (i >= result.length) {
                            ledgerVersion = result[result.length-1].outcome.ledgerVersion;
                            updatedBalance = parseFloat(BigNumber(sum).plus(data.balance))
                            Currency.findOneAndUpdate({
                                'currencies.currency': 'XRP',
                                userId: req.body.user_id
                            }, {
                                $set: {
                                    'currencies.$.balance': updatedBalance,
                                    'currencies.$.lastLedgerVersion': ledgerVersion
                                }
                            }, {
                                new: true
                            }).then((success) => {
                                if (success) return resHndlr.apiResponder(req, res, "Result", 200, success)
                                else return resHndlr.apiResponder(req, res, "Result", 200, data)
                            })
                        }
                    } else {
                        console.log("777777777");
                        return resHndlr.apiResponder(req, res, "Result", 200, data)
                    }
                })
            }).catch((err) => {
                console.log("err::::::::::::",err)
                return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
            })
        } else {
            return resHndlr.apiResponder(req, res, "Sorry you don't have XRP address yet, please visit at XRP page to generate address.", 500)
        }
    })
}
}
