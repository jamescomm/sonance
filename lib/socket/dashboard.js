// const User = require('../user/user');
// const Constants = require('./userConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const Order = require('../exchange/order');
const resHndlr = require("../global/Responder");
var BigNumber = require('bignumber.js');
let orderTrade = (cb)=>{
Order.find({status:true}).sort({processedAt:-1}).select('amount rate total_amount')
.then((success)=>cb(null,success))
.catch((unsccess)=>cb(unsccess))
}


let orderBidPercentage = (cb)=>{
// let date = new Date().getTime() - 60 * 60 * 24 * 1000
// console.log(date)
Order.findOne({_id:"5a7eabac74604126ba296326",type:'BID'}).select('total_amount rate createdAt')
.then((result)=>{
Order.find({type:'BID'}).sort({processedAt: -1}).limit(2).select('total_amount rate market').lean().exec()
.then((success)=>{
	console.log("result, success", result,success )

oldRate = new BigNumber(result.rate);
var cal =  new BigNumber(oldRate.dividedBy(success[0].rate)).multipliedBy(100);
if(success[0]<success[1])
upvote = false
else
upvote = true
let response = success[0];
response.upvote = upvote;
response.cal = cal;
cb(response);
})
})
.catch((unsccess)=>cb(unsccess))
}
module.exports = {
	orderTrade:orderTrade,
	orderBidPercentage:orderBidPercentage
}