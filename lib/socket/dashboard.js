// const User = require('../user/user');
// const Constants = require('./userConstants');
// var exchanges = require('.../exchanges');
const express = require("express");
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const Exchanges = require("../../exchanges");
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const Order = require('../exchange/order');
const resHndlr = require("../global/Responder");
var BigNumber = require('bignumber.js');
const Async = require("async");
const Market = require("../address/market");



let graph = (req,cb)=>{
	Order.find({status:true,'amount.currency':req.query.market,'volume.currency':req.query.currency}).sort({processedAt:-1}).select('amount rate total_amount processedAt')
.then((success)=>{
		var result = [];
	if(success.length)
	{
	var counter = 0;
Async.forEachLimit(success,1,(Currency,next)=>{
counter++;
var data = [];
data.push(Currency.processedAt);
data.push(Currency.rate);
result.push(data);
if(counter<success.length)
next();
else
cb(null,result)
})
}
else
cb(null,result)})
.catch((unsccess)=>cb(unsccess))
}

let orderTrade = (req,cb)=>{
Order.find({status:true,'amount.currency':req.query.market,'volume.currency':req.query.currency}).sort({processedAt:-1}).select('amount rate total_amount processedAt')
.then((success)=>cb(null,success))
.catch((unsccess)=>cb(unsccess))
}

let orderBidPercentage = (cb)=>{
let table = [];
let counter = 0;
Market.findOne({})
.then((successed)=>{
	Async.forEachLimit(successed.currencyData,1,(Currency,next)=>{
		counter++;
		if(Currency.market == true)
			if(counter<successed.currencyData.length)
			next();
			else
			{
			let i = 0;
			for (i; i < successed.currencyData.length; i++) {
				if(successed.currencyData[i].market == false)
				{
				var found = table.find((element) => {
					return (element.market.indexOf(successed.currencyData[i].currency)>=0)
				});
				if (found) 
					continue;
				else
				{
					response = {"rate": 0,
					"market": "BTC/"+successed.currencyData[i].currency,
					"total_amount": 0,
					"upvote": true,
					"cal": "0"}
					table.push(response);
				}
			}
			}
			if (i >= successed.currencyData.length)
			cb(null,table);
		}
		else
		{
			var tsYesterday = new Date(new Date().getTime() - (730 * 60 * 60 * 1000));
			Order.findOne({type:'BID','volume.currency':Currency.currency,createdAt:{$gte:tsYesterday.getTime()}}).select('total_amount rate createdAt')
			.then((result)=>{
			if(!result)
			if(counter<successed.currencyData.length)
			next();
			else
			{
			let i = 0;
			for (i; i < successed.currencyData.length; i++) {
				data = successed.currencyData[i]
				if(successed.currencyData[i].market == false || successed.currencyData[i].market == 'false')
				{
				var found = table.find((element) => {
					return (element.market.indexOf(successed.currencyData[i].currency)>=0)
				});
				if (found) 
					continue;
				else
				{
					response = {"rate": 0,
					"market": "BTC/"+successed.currencyData[i].currency,
					"total_amount": 0,
					"upvote": true,
					"cal": "0"}
					table.push(response);
				}
			}
			}
			if (i >= successed.currencyData.length)
			cb(null,table);
		}
		else
			Order.find({type:'BID','volume.currency':Currency.currency}).sort({processedAt: 1}).limit(2).select('total_amount rate market processedAt').lean().exec()
			.then((success)=>{
			oldRate = new BigNumber(result.rate);
			newRate  = new BigNumber(success[0].rate);
			var cal =  new BigNumber(BigNumber(newRate.minus(oldRate)).dividedBy(success[0].rate)).multipliedBy(100);
			if(success.length>1)
			if(success[0].rate<success[1].rate)
			upvote = false
			else
			upvote = true
			else
			upvote = true	
			let response = success[0];
			response.upvote = upvote;
			response.cal = cal;
			table.push(response);
			if(counter<successed.currencyData.length)
			next();
			else
			{
			console.log("in elseeeeee")
			let i = 0;
			for (i; i < successed.currencyData.length; i++) {
				if(successed.currencyData[i].market == false)
				{
					console.log("in iffffffff")
				var found = table.find((element) => {
					return (element.market.indexOf(successed.currencyData[i].currency)>=0)
				});
				if (found) 
					continue;
				else
				{
					response = {"rate": 0,
					"market": "BTC/"+successed.currencyData[i].currency,
					"total_amount": 0,
					"upvote": true,
					"cal": "0"}
					table.push(response);
				}
			}
			}
			if (i >= successed.currencyData.length)
			cb(null,table);
		}
			})
			})
			.catch((unsccess)=>{console.log("unsccess::::::::::",unsccess);
				cb(unsccess)})
		}
	})
})
.catch((unsccessed)=>console.log("unsuccessed:  ",unsccessed))

}
// {
//     "weightedAvgPrice": "0.29628482",
//     "prevClosePrice": "0.10002000",
//     "lastQty": "200.00000000",
//     "bidPrice": "4.00000000",
//     "askPrice": "4.00000200",
//     "openPrice": "99.00000000",
//     "quoteVolume": "15.30000000",
//     "fristId": 28385,   // First tradeId
//     "lastId": 28460,    // Last tradeId
//   }
let marketInfo = (req,cb)=>{
var tsYesterday = new Date(new Date().getTime() - (730 * 60 * 60 * 1000));
	Order.aggregate([
		{$match:{'amount.currency':req.query.market,'volume.currency':req.query.currency
		,createdAt:{$gte:tsYesterday.getTime()},type:'BID',status:true
	}},
		{$group:
         {
         _id: "$volume.currency"
		,maxQuantity: { $max: "$rate" }
		,minQuantity: { $min: "$rate" }
		,totalVolume: { $sum:'$total_volume'}
		,openDate: { $first: "$createdAt"}
		,lastRate: { $last: "$rate"}
		,firstRate: { $first: "$rate"}
		,closeDate: { $last: "$processedAt"}
		,count:{$sum:1}
	}}
		])
	.then((success)=>{
		if(success.length)
		{let i = 0;
			for(i;i<success.length;i++)
			{
		change = BigNumber(success[i].lastRate).minus(success[i].firstRate);
		let perc = (change.dividedBy(success[i].lastRate)).multipliedBy(100);
		change = parseFloat(change);
		perc = parseFloat(perc);
		success[i].change = change
		success[i].perc = perc
	}
	if(i>=success.length)
		cb(null,success);
	}
	else
		cb(null,success);
	})
	.catch((unsccess)=>{
		console.log(unsccess);
		cb(unsccess)
	})
}
let quantityBarBid = (req,cb)=>{
var tsYesterday = new Date(new Date().getTime() - (730 * 60 * 60 * 1000));
	Order.aggregate([{$match:{'amount.currency':req.query.market,'volume.currency':req.query.currency,type:'BID','status':false,createdAt:{$gte:tsYesterday.getTime()}}},
		{$group:{_id:"$rate",amount:{$sum:"$total_amount"},volume:{$sum:"$total_volume"},
		lastDate:{$last : "$createdAt"},count:{$sum:1}}},{$sort:{"lastDate":-1}}
])
	.then((success)=>cb(null,success))
	.catch((unsccess)=>cb(unsccess))
}
let quantityBarAsk = (req,cb)=>{
var tsYesterday = new Date(new Date().getTime() - (730 * 60 * 60 * 1000));
	Order.aggregate([{$match:{'amount.currency':req.query.market,'volume.currency':req.query.currency,type:'ASK','status':false,createdAt:{$gte:tsYesterday.getTime()}}},
		{$group:{_id:"$rate",amount:{$sum:"$total_amount"},volume:{$sum:"$total_volume"},
		lastDate:{$last : "$createdAt"},count:{$sum:1}}},{$sort:{"lastDate":-1}}
])
	.then((success)=>cb(null,success))
	.catch((unsccess)=>cb(unsccess))
}
module.exports = {
	orderTrade:orderTrade,
	orderBidPercentage:orderBidPercentage,
	marketInfo:marketInfo,
	quantityBarBid:quantityBarBid,
	quantityBarAsk:quantityBarAsk,
	graph:graph
}
