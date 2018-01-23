const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require("../global/Responder");
const Order = require("./order");
const Async = require("async");
const currencyData = require("../address/currencyData");
let exchangeAsk = (Ask,User,userCurrency,callback)=>{
	let amountCurrencyValue = currencyData.currencyData[Ask.amount.currency]
	let volumeCurrencyValue = currencyData.currencyData[Ask.volume.currency]
	if(Ask.amount.value > userCurrency.balance)
		callback("Sorry, you don't have sufficient amount for this Ask.")
	else
	{
		Order.find({'amount.currency':Ask.volume.currency,'volume.currency':Ask.amount.currency,type:'BID',status:'pending'}).sort({createdAt:-1})
		.then((success)=>{
			if(success)
			{
				Async.forEachLimit(success,1,(value,next)=>{
					let remainingVolume = Ask.volume.value - value.volume.value;
					let remainingAmount = Ask.amount.value - value.amount.value;
					if(remainingVolume == 0)
					{
						
					}
					else if(Ask.volume.value>value.volume.value)
					{

					}
					else
					{

					}
				})
			}
			else
			{
				var market = Ask.amount.currency+'/'+Ask.volume.currency;
				Order.create({amount:Ask.amount,rate:Ask.rate,volume:Ask.volume,type:'ASK',userId:Ask.user_id,createdAt:new Date(),market:market})
				.then((success)=>callback(null,success))
				.catch((unsuccess)=>callback(unsuccess))
			}
		})
		.catch(((unsuccess)=>callback(unsuccess)))
			
	}

}

let exchangeBid = (Bid,User,userCurrency,callback)=>{
	let amountCurrencyValue = currencyData.currencyData[Bid.amount.currency]
	let volumeCurrencyValue = currencyData.currencyData[Bid.volume.currency]
	if(Bid.amount.value > userCurrency.balance)
		return callback("Sorry, you don't have sufficient amount for this Bid.")
	else
	{
		Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$inc:{'currencies.$.freezeBalance':Bid.amount.value,'currencies.$.balance':-Bid.amount.value}},{new:true})//INR taken from seller
		.then((success)=>console.log("User bid balance updated initialy : ",success))
		.catch((unsuccess)=>callback(unsuccess))
		Order.find({'volume.currency':Bid.volume.currency,'amount.currency':Bid.amount.currency,type:'ASK',status:false,rate:Bid.rate}).sort({createdAt:-1})
		.then((successed)=>{
			if(successed.length)
			{ let counter = 0;
				Async.forEachLimit(successed,1,(currentAsk,next)=>{
					counter++;
					let remainingVolume = Bid.volume.value - currentAsk.volume.value;
					let remainingAmount = Bid.amount.value - currentAsk.amount.value;
					if(remainingVolume == 0)
					{
						Async.waterfall([
							function(cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$inc:{'currencies.$.freezeBalance':-Bid.volume.value}},{new:true})//INR taken from seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$inc:{'currencies.$.balance':Bid.amount.value}},{new:true})//btc given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$inc:{'currencies.$.balance':currentAsk.volume.value}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$inc:{'currencies.$.freezeBalance':-currentAsk.amount.value}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':0,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':0,type:'BID',userId:Bid.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:Bid.amount.value,total_volume:Bid.volume.value})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							Order.update({_id:currentAsk._id},{'amount.value':0,'volume.value':0,status:true},{new:true})
							.then((success)=>cb(null,success))
							.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(error,success)
							{
								if(error)
									callback(error)
								else
								{
									Bid.volume.value = Bid.volume.value - currentAsk.volume.value;
									Bid.amount.value = Bid.amount.value - currentAsk.amount.value;
									callback(null,success)
								}

							})

					}
					else if(remainingVolume>0)
					{
						Async.waterfall([
							function(cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$inc:{'currencies.$.freezeBalance':-Bid.volume.value}},{new:true})//INR taken from seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$inc:{'currencies.$.balance':Bid.amount.value}},{new:true})//btc given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$inc:{'currencies.$.balance':currentAsk.volume.value}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$inc:{'currencies.$.freezeBalance':-currentAsk.amount.value}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							Order.update({_id:currentAsk._id},{'amount.value':0,'volume.amount':0,status:true},{new:true})
							.then((success)=>cb(null,success))
							.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									callback(err);
								else
								{
									Bid.volume.value = Bid.volume.value - currentAsk.volume.value;
									Bid.amount.value = Bid.amount.value - currentAsk.amount.value;
									if(counter<successed.length)
									next();
								else
								{
								let amount = currentAsk.amount.value - Bid.amount.value;
								let volume = currentAsk.volume.value - Bid.volume.value
								Order.update({_id:currentAsk._id},{$inc:{'amount.value':amount,'volume.value':volume}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
								}
								}
							})
					}
					else
					{
						Async.waterfall([
							function(cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$inc:{'currencies.$.freezeBalance':-Bid.volume.value}},{new:true})//INR taken from seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$inc:{'currencies.$.balance':Bid.amount.value}},{new:true})//btc given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$inc:{'currencies.$.balance':currentAsk.volume.value}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$inc:{'currencies.$.freezeBalance':-currentAsk.amount.value}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':0,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':0,type:'BID',userId:Bid.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:Bid.amount.value,total_volume:Bid.volume.value})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								let amount = currentAsk.amount.value - Bid.amount.value;
								let volume = currentAsk.volume.value - Bid.volume.value
								Order.update({_id:currentAsk._id},{$inc:{'amount.value':amount,'volume.value':volume}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									callback(err);
								else
									callback(success);
							})
					}
				})
			}
			else
			{
				var market = Bid.amount.currency+'/'+Bid.volume.currency;
				Order.create({amount:Bid.amount,rate:Bid.rate,volume:Bid.volume,type:'BID',userId:Bid.user_id,createdAt:new Date(),market:market})
				.then((success)=>callback(null,success))
				.catch((unsuccess)=>callback(unsuccess))
			}
		})
		.catch(((unsuccess)=>callback(unsuccess)))
			
	}

	
}
module.exports = {
	exchangeAsk:exchangeAsk,
	exchangeBid:exchangeBid
}