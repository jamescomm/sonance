// Models=====================================
var User = require('../models/users.js');
var UserAddress = require('../models/userAddress.js');
var Token = require('../models/tokens.js');
var ICO = require('../models/icos.js');
var Mail = require('../models/SendMail.js');
var SMS = require('../models/SendSms.js');
// ================================================

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Constant = require('../../config/constants');
var config = require('../../config/passport_config.js');
var jwt = require('jsonwebtoken');
var HttpStatus = require('http-status-codes');
var GlobalMessages = require('../../config/constantMessages');
var messageHandler = require('../../config/messageHandler');

var Accounts = require('web3-eth-accounts');
var Coinpayments = require('coinpayments');
var client = new Coinpayments(coinPayment); 

const coinPayment = {
    key : "b175d3557680c61449dc851d23adb062b79ebcfc3e0f93f1472d8e0878649b3f",
    secret : "62BA78ED5ad8dE6eEC0635aec2e80d64d70A156bc31c103335539d830f1cB0f0",
    autoIpn : true,
    ipnTime : true
};
// var Tx = require('ethereumjs-tx');
// var privateKey = new Buffer('kunvar@123', 'hex')

const request = require('request');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var Web3 = require('web3');

var accounts = new Accounts('ws://192.168.0.123:8546');
var personal = new Personal('ws://192.168.0.123:8546');
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.123:8546'));

var createETHaddress = function(req, res){
    var email = req.body.email;
    // var password = req.body.password;

    if(!email) res.status(HttpStatus.BAD_REQUEST).send({msg: 'Please enter Email ID', status: HttpStatus.BAD_REQUEST});

    web3.eth.personal.newAccount('kunvar@123').then((data) => {}).catch(()=>)
        let userOBJ = {
            email : email,
            ETHaddress : [{ "address": data }]
        };

        if(data){
            console.log('Address::::'+data);

            User.findOne({email : email}, function(err, user){

            if(err) res.status(HttpStatus.BAD_REQUEST).send({data: data, status: HttpStatus.BAD_REQUEST});
            
            if(!user) {
                res.status(HttpStatus.BAD_REQUEST).send({data: [],message : 'User Not found!.', status: HttpStatus.BAD_REQUEST});
            }

            if(user){

                UserAddress.findOne({email : email} , function(err, user1){

                    if(user1){
                        UserAddress.update({ email : email },
                            { $push : { 
                                        ETHaddress :  { "address": data }
                                    } 
                            }, function(err, updatedata){
                            if(err){
                                res.status(HttpStatus.BAD_REQUEST).send({data: data, status: HttpStatus.BAD_REQUEST});
                            }
                            if(updatedata){
                                res.status(HttpStatus.OK).send({data: data, message : 'Address create successfully', status: HttpStatus.OK});
                            }
                        });
                    }

                    else{
                        UserAddress.create(userOBJ , function(err, user){
                            res.status(HttpStatus.OK).send({data: data, status: HttpStatus.OK, message : 'Address create successfully'});
                        });
                    }
                }); 
            }

         })

        }
        else{
            res.status(HttpStatus.BAD_REQUEST).send({data: [],message : 'Error in address generate on ETH Node', status: HttpStatus.BAD_REQUEST});
        }
    });
    
    // if(userAccount){

    //  UserAddress.findOne({email : email}, function(err, user){

    //      if(err) res.status(HttpStatus.BAD_REQUEST).send({data: userAccount, status: HttpStatus.BAD_REQUEST});
            
    //      if(!user) {

    //           web3.eth.personal.newAccount('kunvar@123').then((data) => {
    //              let userOBJ = {
    //                  email : email,
    //                  ETHaddress : [{ "address": data }]
    //              };

    //              UserAddress.create(userOBJ , function(err, user){
    //                  res.status(HttpStatus.OK).send({data: user, status: HttpStatus.OK, message : 'Address create successfully'});
    //              });

    //             // res.send({status : 200, message : 'Address create successfully ', data : data});
    //          });

                

    //      }

    //      if(user){
    //          UserAddress.update({ email : email },
    //              { $push : { 
    //                           ETHaddress :  { "address": userAccount.address }
    //                      } 
    //              }, function(err, data){
    //              if(err){
    //                  res.status(HttpStatus.BAD_REQUEST).send({data: userAccount, status: HttpStatus.BAD_REQUEST});
    //              }
    //              if(data){
    //                  res.status(HttpStatus.OK).send({data: userAccount, status: HttpStatus.OK});
    //              }
    //           });
    //      }
    //  })
        
    // }
    // else{
    //  res.status(HttpStatus.BAD_REQUEST).send({data: userAccount, status: HttpStatus.BAD_REQUEST});
    // }
}

var getAllETHaddress = function(req, res){
    var addresses = web3.eth.getAccounts().then((data)=>{
      if(data){
         res.send({status : 200, data : data , message : 'Address on Ethrium Node.'});
      }
      else{
         res.send({status : 200, data : data , message : 'No Data Found!.'}); 
      }
    });
}

var getBalanceByAddress = function(req, res){
    let userAdd = req.body.address;

    if(userAdd){
          var addresses = web3.eth.getBalance(userAdd).then((data)=>{
          if(data){
            data = data / Constant.ETHnodeURL.ETHdecimals;
             res.send({status : 200, data : data , message : 'Address Balance on Ethrium Node.'});
          }
          else{
             res.send({status : 200, data : data , message : 'No balance Data Found!.'}); 
          }
        });
    }
    else{
        res.send({status : 400, data : 0 , message : 'Please send user address!.'}); 
    }
}

var getTokenBalanceByAddress = function(req, res){
    let tokenName = req.body.ETHtokenAddress;
    let address = req.body.ETHaddress;
    if(tokenName && address) {
          var opt = {
              method: 'GET',
              headers: {'content-type': 'application/json', 'charset':'utf-8'},
              json: true
            };
            var data = {};
            opt.url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdd974d5c2e2928dea5f71b9825b8b646686bd200&address=0xC5258FF205875A10D89EDD6d1Bd96A8c237C8D13&tag=latest&apikey=I5AV4RC7F5EM9RNR3EFW1H6MQTDU6XUWUQ`;
            request(opt, function (err, response, body) {
              if(err)
                return res.json({
                  message: "Failed to get data from etherscan.io",
                  statusCode: 400
                })
              res.send({status : 200, data : body , message : 'Tx Data'}); 
            });  
    }
    else{
        res.send({status : 400, message : 'Please Enter Token Name and Address'}); 
    }       
}

var getTransactionByAddress = function(req, res){
    let hashAddress = req.body.TxHashAddress;
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
     
}

var getTransactionsByAccount = function(req, res){
    let myaccount = req.body.address;
    // let startBlockNumber = req.body.startBlock;
    // let endBlockNumber = req.body.endBlock;
    let startBlockNumber = 1;
    let endBlockNumber = 6;

        if (endBlockNumber == null) {
            endBlockNumber = web3.eth.blockNumber;
            console.log("Using endBlockNumber: " + endBlockNumber);
          }
          if (startBlockNumber == null) {
            startBlockNumber = endBlockNumber - 1000;
            console.log("Using startBlockNumber: " + startBlockNumber);
          }
          console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
           let tx = [];



            // var Awesomify = {
            //   transform : function(user, callback) {
            //     callback(null, user);
            //   }
            // };

           var counter = 0;
            for(var i = startBlockNumber; i <= endBlockNumber; i++) {
                web3.eth.getBlock(i,true).then(function(result) {
                    // tx.push(result.transactions);
                    let txData = result.transactions;
                    if(txData.length){
                        if(txData[0].from === myaccount){
                            let trxData = {
                                blockHash : txData[0].blockHash,
                                blockNumber : txData[0].blockNumber,
                                from : txData[0].from,
                                gas :txData[0].gas,
                                gasPrice : txData[0].gasPrice,
                                hash : txData[0].hash,
                                input : txData[0].input,
                                nonce : txData[0].nonce,
                                to : txData[0].to,
                                transactionIndex : txData[0].transactionIndex,
                                value : txData[0].value/Constant.ETHnodeURL.ETHdecimals,
                                v : txData[0].v,
                                r : txData[0].r,
                                s : txData[0].s
                            };

                            tx.push(trxData);
                        }
                    }
                    else{
                        res.send({status : 200, message : 'No transactions found.', data : []});
                    }
                    if(counter == endBlockNumber - 1) {
                        res.send({status : 200, message : 'Your transactions', data : tx});
                    }
                    counter++;
                })
            }


          // for (var i = startBlockNumber; i <= endBlockNumber; i++) {
          //   if (i % 1000 == 0) {
          //     console.log("Searching block " + i);
          //   }
           
          //   var block = web3.eth.getBlock(i, true).then(function(data){
          //    console.log('TXXXXXXXX'+i,data.transactions);
          //    tx.push(data.transactions);
          //   });
       //  }
        // if(i > endBlockNumber) res.send({status : 200, message : 'Your transactions', data : tx});
}

var signAndSendTransaction = function(req, res){
     let fromAddress = req.body.fromAddress;
     let toAddress = req.body.toAddress;

     if(fromAddress && toAddress){
        web3.personal.signAndSendTransaction({'to': toAddress, 'from': fromAddress ,'value': 12345}, 'kunvar@123')
        .then(function(data){
            console.log('dataaaaa'+data);
        })

     }else{
        res.send({status : 200, message : 'Please send all parameter'}); 
     }
}

var sendTransaction = function(req, res){
     let fromAddress = req.body.fromAddress;
     let toAddress = req.body.toAddress;
     web3.eth.personal.unlockAccount(fromAddress,'kunvar@123', 15000);

     if(fromAddress && toAddress){
        web3.eth.sendTransaction({from: fromAddress, to:toAddress, value: web3.utils.toWei('1', 'ether'),
         gasLimit: 21000, gasPrice: 20000000000})
           .on('transactionHash', function(hash){
            console.log('transactionHash:::::::::'+hash);
            res.send({status : 200, transactionHash : hash });
            })
            .on('receipt', function(receipt){
                console.log('receipt'+receipt);
                res.send({status : 200, receipt : receipt });
            })
            .on('confirmation', function(confirmationNumber, receipt){ 
                console.log('confirmationNumber'+receipt);
                res.send({status : 200, confirmationNumber : confirmationNumber, receipt:receipt });
             })
            .on('error', function(err){
                res.send({status : 400, message : 'Insufficet balance',error : err });
            });

     }else{
        res.send({status : 200, message : 'Please send all parameter'}); 
     }
}

var withdrawEth = function(req, res){
     let fromAddress = req.body.fromAddress;
     let toAddress = req.body.toAddress;
     let amount = req.body.amount;

     web3.eth.personal.unlockAccount(fromAddress,'kunvar@123', 15000);

     if(fromAddress && toAddress){
        web3.eth.sendTransaction({from: fromAddress, to:toAddress, value: web3.utils.toWei(amount, 'ether'),
         gasLimit: 21000, gasPrice: 20000000000})
           .on('transactionHash', function(hash){
            console.log('transactionHash:::::::::'+hash);
            res.send({status : 200, transactionHash : hash, message : 'ETH withraw successfully!.' });
            })
            .on('receipt', function(receipt){
                console.log('receipt'+receipt);
                res.send({status : 200, receipt : receipt });
            })
            .on('confirmation', function(confirmationNumber, receipt){ 
                console.log('confirmationNumber'+receipt);
                res.send({status : 200, confirmationNumber : confirmationNumber, receipt:receipt });
             })
            .on('error', function(err){
                res.send({status : 400, message : 'Insufficet balance',error : err });
            });

     }else{
        res.send({status : 200, message : 'Please send required parameter'}); 
     }
}

var getTransaction = function (req, res){
    accounts.signTransaction({
    to: '0xdc3b08D1c0551cbEB587732C94B452223F72AE1A',
    value: '1000000000',
    gas: 2000000
    }, '62BA78ED5ad8dE6eEC0635aec2e80d64d70A156bc31c103335539d830f1cB0f0')
    .then(console.log);

}

var submitICO = function(req, res){
    let userId = req.body.userId;
    let email = req.body.email;
    let tokenName = req.body.tokenName;
    let toeknAddress = req.body.toeknAddress;
    let tokenTicker = req.body.tokenTicker;
    let toeknValue = req.body.toeknValue;
    let investorMinCap = req.body.investorMinCap;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let tokenRate = req.body.tokenRate;
    let tokenSupply = req.body.tokenSupply;

    if(email && tokenName){

        let ICOOBJ = {
                userId : userId,
                email  : email,
                tokenName : tokenName,
                tokenTicker : tokenTicker,
                toeknAddress : [{ "contractAddress": toeknAddress }],
                toeknValue: toeknValue,
                investorMinCap: investorMinCap,
                startTime : startTime,
                endTime:endTime,
                tokenRate: tokenRate,
                tokenSupply: tokenSupply,
            };

        User.findOne({email : email}, function(err, ico){

            if(err) res.status(HttpStatus.BAD_REQUEST).send({data: data, status: HttpStatus.BAD_REQUEST});
            
            if(!ico) {
                res.status(HttpStatus.BAD_REQUEST).send({data: [],message : 'User Not found!.', status: HttpStatus.BAD_REQUEST});
            }

            if(ico){

                ICO.findOne({email : email} , function(err, ico1){
                    if(err) res.status(HttpStatus.BAD_REQUEST).send({data: data, status: HttpStatus.BAD_REQUEST});
                    if(ico1){
                        ICO.update({ email : email },
                            { $push : { 
                                        toeknAddress :  { "contractAddress": toeknAddress }
                                    } 
                            }, function(err, data){
                            if(err){
                                res.status(HttpStatus.BAD_REQUEST).send({data: data, status: HttpStatus.BAD_REQUEST});
                            }
                            if(data){
                                res.status(HttpStatus.OK).send({data: data, message : 'ICO has been submitted successfully',status: HttpStatus.OK});
                            }
                        });
                    }

                    else{

                        ICO.create(ICOOBJ, function(err, ico2){
                                if(err) res.send({status : 400, message : 'Error in saved into DB'+err});
                                if(ico2){
                                    res.send({status : 200, message : 'ICO has been submitted successfully'});
                                }
                        });
                    }
                }); 
            }

         })
            
        // ICO.create(ICOOBJ, function(err, ico){

        //      if(err) res.send({status : 400, message : 'Error in saved into DB'});
        //      if(ico){
        //          res.send({status : 200, message : 'ICO has been submitted successfully'});
        //      }
        // });
    }
    else{
        res.send({status : 400, message : 'Please send required params'});
    }
}

// var getTokenByAddress = function(req, res){
//  let icoAddress = req.body.address;
    
//  if(icoAddress){
//      let condition = {
//          toeknAddress : icoAddress
//      };

//      ICO.findOne(condition,{}).exec(function(err,ico){

//          if(err) res.send({status : 400, message : 'Error in saved into DB'});
//          if(ico){
//              res.send({status : 200, data : ico});
//          }
//          if(!ico){
//              res.send({status : 200, data : [], message : 'No Data found'});
//          }
//      });
//  }
//  else{
//      res.send({status : 400, message : 'Please send required params'});
//  }
// }

var getAllTokens = function(req, res){
    
        ICO.find({},{}).exec(function(err,token){

            if(err) res.send({status : 400, message : 'Error in saved into DB'});
            if(token){
                res.send({status : 200, data : token});
            }
            if(!token){
                res.send({status : 200, data : [], message : 'No ICO token Data found'});
            }
        });
}


var storeTokenInformation = function(req, res){
    let crowdSaleAddress = req.body.crowdSaleAddress;
    let tokenAddress = req.body.tokenAddress;

    if(crowdSaleAddress && tokenAddress){
        let tokenOBJ = {
                crowdSaleAddress : crowdSaleAddress,
                tokenAddress : tokenAddress
            };

        Token.create(tokenOBJ, function(err, data){

            if(err) res.send({status : 400, message : 'Error in saved into DB'});
            if(data){
                res.send({status : 200, message : 'Token has been Saved successfully'});
            }
        });
    }
    else{
        res.send({status : 400, message : 'Please send crowdSaleAddress and token Address'});
    }
}

var getReactData = function(req, res){
    console.log('React Data', req.body);
}

var savedICOtokenIntoDB = function(req, res){
    let userId = req.body.userId;
    let tokenName = req.body.token.name;
    let toeknAddress = req.body.token.toeknAddress;
    let tokenTicker = req.body.token.ticker;
    let toeknValue = req.body.token.value;
    let investorMinCap = req.body.investorMinCap;
    let startTime = req.body.crowdsale[0].startTime;
    let endTime = req.body.crowdsale[0].endTime;
    let tokenRate = req.body.tokenRate;
    let tokenDecimals = req.body.token.decimals;
    let tokenSupply = req.body.crowdsale[0].supply;
    let walletAddress = req.body.crowdsale[0].walletAddress;
    let reservedTokens = req.body.token.reservedTokens;

    let optimized = req.body.optimized;
    let contractName = req.body.contractName;
    let contractType = req.body.contractType;
    
    console.log('React post data', req.body);
    if(userId){

        let ICOOBJ = {
                userId: userId,
                tokenName : tokenName,
                tokenTicker : tokenTicker,
                toeknValue: toeknValue,
                investorMinCap: investorMinCap,
                startTime : startTime,
                endTime:endTime,
                tokenRate: tokenRate,
                tokenSupply: tokenSupply,
                walletAddress : walletAddress,
                tokenDecimals : tokenDecimals,
                reservedTokens : reservedTokens,
                optimized :optimized,
                contractName: contractName,
                contractType : contractType,
            };

            User.findOne({ _id : userId}, function(err, user){
                    console.log('users found in DB for token saving:::');   
                    if(err) res.status(HttpStatus.BAD_REQUEST).send({data: user, status: HttpStatus.BAD_REQUEST});
                    
                    if(!user) {
                        res.status(HttpStatus.BAD_REQUEST).send({data: [],message : 'User Not found!.', status: HttpStatus.BAD_REQUEST});
                    }

                    if(user){
                        ICO.create(ICOOBJ, function(err, ico){
                            console.log('icos:::',ico); 
                            if(err) res.status(HttpStatus.BAD_REQUEST).send({data: ico, status: HttpStatus.BAD_REQUEST});
                    
                            if(!ico) {
                                res.status(HttpStatus.BAD_REQUEST).send({data: [],message : 'User Not found!.', status: HttpStatus.BAD_REQUEST});
                            }
                            if(ico){
                                res.send({status : 200, message : 'Token has been created successfully!.'})
                            }
                       });
                    }
                }); 
        }else{
            res.send({status : 400, message : 'Please send required params'});      
        }
}

var getTokenByUserId = function(req, res){
        let userId = req.body.userId;
        if(userId){
            ICO.find({ userId : userId},{}).populate('userId',{}).exec(function(err,token){

                if(err) res.send({status : 400, message : 'Error in saved into DB'});
                if(token){
                    res.send({status : 200, data : token});
                }
                if(!token){
                    res.send({status : 200, data : [], message : 'No ICO token Data found'});
                }
            });
        }
        else{
            res.send({status : 400, data : [], message : 'Please Enter token ID'});
        }
}
// var coinPayment = function (req,res){
//  console.log('I am inside the coin payment');
//  client.rates(function(err,data){
//      if(err){
//              res.status(HttpStatus.BAD_REQUEST).send({msg: err, status: HttpStatus.BAD_REQUEST});
//         }else{
//          res.status(HttpStatus.OK).send({data: data, status: HttpStatus.OK});
//         }
//  });
// }

// var paymentWithrawIntoWallet = function (req,res){
//  client.createWithdrawal({'currency' : 'POT', 'amount' : 10, 'address': 'INSERT_WALLET_ADDRESS'},
//      function(err,result){
//      if(err){
//              res.status(HttpStatus.BAD_REQUEST).send({msg: err, status: HttpStatus.BAD_REQUEST});
//         }else{
//          res.status(HttpStatus.OK).send({data: result, status: HttpStatus.OK});
//         }
// });
        
// }

// var createTransaction = function (req,res){
//  client.createTransaction({'currency1' : 'BTC', 'currency2' : 'ETH', 'amount' : 10, "address" : "0xdc3b08D1c0551cbEB587732C94B452223F72AE1A"},function(err,result){
//      if(err){
//              res.status(HttpStatus.BAD_REQUEST).send({msg: err, status: HttpStatus.BAD_REQUEST});
//         }else{
//          res.status(HttpStatus.OK).send({data: result, status: HttpStatus.OK});
//         }
// });
        
// }


//  functions
// exports.coinPayment = coinPayment;
// exports.paymentWithrawIntoWallet = paymentWithrawIntoWallet;
// exports.createTransaction = createTransaction;

exports.createETHaddress = createETHaddress;
exports.getAllETHaddress = getAllETHaddress;
exports.getBalanceByAddress = getBalanceByAddress;
exports.getTransaction = getTransaction;
exports.getTokenBalanceByAddress = getTokenBalanceByAddress;
exports.getTransactionByAddress = getTransactionByAddress;
exports.storeTokenInformation = storeTokenInformation;

exports.submitICO = submitICO;
// exports.getTokenByAddress = getTokenByAddress;
exports.getAllTokens = getAllTokens;

exports.sendTransaction = sendTransaction;
exports.withdrawEth = withdrawEth;
exports.getTransactionsByAccount = getTransactionsByAccount;
exports.signAndSendTransaction = signAndSendTransaction;

exports.savedICOtokenIntoDB = savedICOtokenIntoDB;
exports.getReactData = getReactData;
exports.getTokenByUserId = getTokenByUserId;