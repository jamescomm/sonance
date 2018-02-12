// const User = require('../user/user');
// const Constants = require('./userConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const Order = require('../exchange/order');
const resHndlr = require("../global/Responder");
var BigNumber = require('bignumber.js');
const Async = require("async");
const Market = require("../address/market");
let orderTrade = (cb)=>{
Order.find({status:true}).sort({processedAt:-1}).select('amount rate total_amount processedAt')
.then((success)=>cb(null,success))
.catch((unsccess)=>cb(unsccess))
}
let orderBidPercentage = (cb)=>{
let table = [];
let counter = 0;
Market.findOne({}).select('currencyData.currency currencyData.market')
.then((successed)=>{console.log("successed: ",successed.currencyData.length)
	Async.forEachLimit(successed.currencyData,1,(Currency,next)=>{
		counter++;
		if(Currency.market == true)
			if(counter<successed.currencyData.length)
			next();
			else
			cb(null,table);
		else
		{
			console.log(Currency.currency)
			Order.findOne({type:'BID','volume.currency':Currency.currency}).select('total_amount rate createdAt')
			.then((result)=>{
			if(!result)
			if(counter<successed.currencyData.length)
			next();
			else
			cb(null,table);
		else
			Order.find({type:'BID','volume.currency':Currency.currency}).sort({processedAt: 1}).limit(2).select('total_amount rate market processedAt').lean().exec()
			.then((success)=>{
				console.log("result, success", result,success )
			oldRate = new BigNumber(result.rate);
			var cal =  new BigNumber(oldRate.dividedBy(success[0].rate)).multipliedBy(100);
			if(success[0].rate<success[1].rate)
			upvote = false
			else
			upvote = true
			let response = success[0];
			response.upvote = upvote;
			response.cal = cal;
			table.push(response);
			if(counter<successed.currencyData.length)
			next();
			else
			cb(null,table);
			})
			})
			.catch((unsccess)=>cb(unsccess))
		}
	})
})
.catch((unsccessed)=>console.log("unsuccessed:  ",unsccessed))

}
let marketInfo = (cb)=>{
	Order.aggregate([{$match:{'amount.currency':'BCH'}}
		,{$group:
         {
         _id: "$amount.currency"
		,maxQuantity: { $max: "$rate" }
		,minQuantity: { $min: "$rate" }
		,totalVolume: { $sum:'$total_volume'}
		,lastRate: { $last: "$rate"}
		,firstRate: { $first: "$rate"}
	}}
		])
	.then((success)=>{
		console.log("success: ",success)
		change = BigNumber(success[0].lastRate).minus(success[0].firstRate);
		let perc = (change.dividedBy(success[0].lastRate)).multipliedBy(100);
		change = parseFloat(change);
		perc = parseFloat(perc);
		success[0].change = change
		success[0].perc = perc
		cb(null,success);
	})
	.catch((unsccess)=>{
		console.log(unsccess);
		cb(unsccess)
	})
}
module.exports = {
	orderTrade:orderTrade,
	orderBidPercentage:orderBidPercentage,
	marketInfo:marketInfo
}