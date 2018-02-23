var paypal = require('paypal-rest-sdk');
paypal.configure({
    "host": "api.sandbox.paypal.com",
    "client_id": "Ae49FxsLDxblfpzOHeqT2eO86F5l7fzyBtESraSABL0P8FXnxz0xJfDzTdwU88e_aLDR-ZWM4_wBX_Eo",
    "client_secret": "EPXccHuxrPtjZ01cGjuZjgu7Fr7oSnvar8BdK_ezMejf7eSFBEQKOlbIVYp0d3gNL3KgHCCeKLWNebHh"
});
const resHndlr = require("./global/Responder");
const Currencies = require('./currency/currencies');
var BigNumber = require('bignumber.js');
//**********************************apis****************************************
function updateUserUsd(req,res,updatedBalance,transactions)
{
     Currencies.findOneAndUpdate({'currencies.currency':'USD',userId:req.query.userId},{$set:{'currencies.$.balance':updatedBalance},$push:{transactions:transactions}},{new:true})
                   .then((result)=>{
                    console.log("*****************************************",result)
                    return resHndlr.apiResponder(req, res, 'successfully.', 200,result)
                   })
                   .catch((unsuccess)=>{return resHndlr.apiResponder(req, res, 'unsuccess.', 400,unsuccess)})
}

exports.success = function(req, res) {
    var ArrayIDs = [];
    console.log("success k parameters:   ", req.params,req.query)


        var paymentId = req.query.paymentId;
        console.log("suceess in payment", req.query)
        var payerId = req.query.PayerID;
        var details = {
            "payer_id": payerId
        };
     
        paypal.payment.execute(paymentId, details, function(error, payment) {
          if(error)
            resHndlr.apiResponder(req, res, 'Something went wrong,if amount deducted it will be refund within 24 hrs.', 400)
        else
             {
                transactions = {
                    transactionId:payment.id,
                    amount:req.query.amount,
                    createdAt:new Date().getTime()
                }
                Currencies.findOne({'currencies.currency':'USD',userId:req.query.userId},{'currencies.$':1})
                .then((success)=>{
                    console.log("11111111111",success)
                    updatedBalance = parseFloat(BigNumber(req.query.amount).plus(success.currencies[0].balance))
                    console.log("2222222222222222",updatedBalance)
                   return updateUserUsd(req,res,updatedBalance,transactions);
                })
                .catch((unsuccess)=>{resHndlr.apiResponder(req, res, 'Something went wrong,if amount deducted it will be refund within 24 hrs.', 400,payment)})
             }
           
        });
}
exports.cancel = function(req, res) {
    res.send("Payment canceled successfully.");
}
exports.paynow = function(req, res) {
    console.log("req.query::   ",req.query.userId,req.query.amount)
    if(!req.query.amount || !req.query.userId)
        resHndlr.apiResponder(req, res, 'Please fill the required fields.', 400)
    else
    {
                          var payment = {
                            "intent": "sale",
                            "payer": {
                                "payment_method": "paypal"
                            },
                            "redirect_urls": {
                                "return_url": "http://192.168.0.130:5000/exchanges/api/v1/transection/success?userId="+req.query.userId+"&amount="+req.query.amount,
                                "cancel_url": "http://192.168.0.130:5000/exchanges/api/v1/transection/cancel"
                            },
                            "transactions": [{
                                "amount": {
                                    "total": parseInt(req.query.amount),
                                    "currency": "USD"
                                },
                                "description": "payment deatils of your transaction."
                            }]
                        };
                        paypal.payment.create(payment, function(error, payment) {
                            if (error) {
                                console.log(JSON.stringify(error));
                            } else {
                                if (payment.payer.payment_method === 'paypal') {
                                    var redirectUrl;
                                    for (var i = 0; i < payment.links.length; i++) {
                                        var link = payment.links[i];
                                        if (link.method === 'REDIRECT') {
                                            redirectUrl = link.href;
                                        }
                                    }
                                    console.log("redirectUrl |||||||||||||||||| ",redirectUrl)
                                    res.redirect(redirectUrl);
                                    // res.send(redirectUrl)
                                }
                            }
                        });
                    }
}

