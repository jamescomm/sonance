const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require("../global/Responder");
const Order = require("./order");
const Async = require("async");
const currencyData = require("../address/currencyData");
var BigNumber = require('bignumber.js');
const Market = require('../address/market');
// Currencies.create({userId:"5a60471a519f873df089df26"})
// .then((success)=>console.log(success))
// .catch((unsuccess)=>console.log(unsuccess))
function findData(currency,userId,callback)
{
Currencies.findOne({'currencies.currency': currency,userId:userId},{'currencies.$':1})//BTC taken from buyer
.then((success)=>callback(null,success.currencies[0]))
.catch((unsuccess)=>callback(unsuccess))
}
// findData('INR',"5a60471a519f873df089df26")




//********************************************************************************************************************************
let exchangeAsk = (Ask,User,userCurrency,callback)=>{
	// console.log("-->",Ask.volume.value,"-----------------------------",User,"-----------------------",userCurrency)
	// let amountCurrencyValue = currencyData.currencyData[Ask.amount.currency]
	// let volumeCurrencyValue = currencyData.currencyData[Ask.volume.currency]
	Market.findOne()
    .then((data) => {
    if((Ask.volume.value*Ask.rate) != Ask.amount.value)
    {
		let err = {}
		err.message = "Please do not try with fake values."
		return callback(err)
	}
 	var amountCurrencyValue = data.currencyData.find((element)=>{return element.currency == Ask.amount.currency});
	var volumeCurrencyValue = data.currencyData.find((element)=>{return element.currency == Ask.volume.currency});
	let fee = new BigNumber(Ask.volume.value);
	let percent = (fee.multipliedBy(.001))
	percent = new BigNumber(percent)
	fee = percent.plus(fee);
	fee = parseFloat(fee);
	fz = new BigNumber(userCurrency.freezeBalance)
	bln = new BigNumber(userCurrency.balance)
	dec = fz.plus(Ask.volume.value)
	inc = bln.minus(fee)
	parseFloat(dec);
	parseFloat(inc);
	if(fee > userCurrency.balance)
	{
		let err = {}
		err.message = "Sorry, you don't have sufficient amount for this Ask."
		return callback(err)
	}
	else
	{
		Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$set:{'currencies.$.freezeBalance':dec,'currencies.$.balance':inc}},{new:true})//INR taken from seller
		.then((success)=>
			console.log("11111111111111111111111 : ")
			)
		.catch((unsuccess)=>callback(unsuccess))
			let volumeOfInitialAsk = Ask.volume.value
			let amountOfInitialAsk = Ask.amount.value
			 trade();
				async function trade(){
					Order.findOneAndUpdate({rate:Ask.rate,'volume.currency':Ask.volume.currency,'amount.currency':Ask.amount.currency,type:'BID',status:false,isCancel:false,isEngage:false},{$set:{isEngage:true}},{new:true}).sort({createdAt:-1}).exec()
					.then((currentBid)=>{
						if(currentBid)
						{
					Ask.volume.value = parseFloat(Ask.volume.value);
					Ask.amount.value = parseFloat(Ask.amount.value);
					currentBid.volume.value = parseFloat(currentBid.volume.value);
					currentBid.amount.value = parseFloat(currentBid.amount.value);
					let remainingVolume =  BigNumber(Ask.volume.value).minus(currentBid.volume.value);
					let remainingAmount =  BigNumber(Ask.amount.value).minus(currentBid.amount.value);
				parseFloat(remainingAmount)
				parseFloat(remainingVolume)
					if(remainingVolume == 0)
					{
						Async.waterfall([
							function(cb)
							{
								findData(currentBid.amount.currency,currentBid.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(Ask.amount.value) 
							        console.log(parseFloat(data))
							        Currencies.findOneAndUpdate({'currencies.currency':currentBid.amount.currency,userId:currentBid.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//BTC taken from buyer
									.then((success)=>cb(null,success))
									.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
							},
							function(success,cb)
							{
								findData(currentBid.volume.currency,currentBid.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(Ask.volume.value) 
							        console.log(parseFloat(data))
							        Currencies.findOneAndUpdate({'currencies.currency':currentBid.volume.currency,userId:currentBid.userId},{$set:{'currencies.$.balance':data}},{new:true})//INR given to seller
									.then((success)=>cb(null,success))
									.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Ask.volume.currency,Ask.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(currentBid.volume.value) 
							        console.log(parseFloat(data))
							        Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$set:{'currencies.$.freezeBalance':data}},{new:true})//inr taken from buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Ask.amount.currency,Ask.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(currentBid.amount.value) 
							        console.log(parseFloat(data))
							        Currencies.findOneAndUpdate({'currencies.currency':Ask.amount.currency,userId:Ask.user_id},{$set:{'currencies.$.balance':data}},{new:true})//btc given to buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
							},
							function(success,cb)
							{
								var market = Ask.amount.currency+'/'+Ask.volume.currency;
								Order.create({status:true,'amount.currency':Ask.amount.currency,'amount.value':0,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':0,type:'ASK',userId:Ask.user_id,createdAt:new Date().getTime(),processedAt:new Date().getTime(),market:market,total_amount:amountOfInitialAsk,total_volume:volumeOfInitialAsk})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							Order.update({_id:currentBid._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date().getTime()},{new:true})
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
									// Ask.volume.value = Ask.volume.value - currentBid.volume.value;
									// Ask.amount.value = Ask.amount.value - currentBid.amount.value;
									callback(null,success,'Your Ask executed successfully.')
								}

							})
					}
					else if(remainingVolume>0)
					{ 
						Async.waterfall([
							function(cb)
							{
								findData(currentBid.amount.currency,currentBid.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(currentBid.amount.value) 
							        console.log(parseFloat(data))
							        Currencies.findOneAndUpdate({'currencies.currency':currentBid.amount.currency,userId:currentBid.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//BTC taken from buyer
								.then((success)=>{cb(null,success)})
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(currentBid.volume.currency,currentBid.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(currentBid.volume.value) 
							        console.log(parseFloat(data))
							        Currencies.findOneAndUpdate({'currencies.currency':currentBid.volume.currency,userId:currentBid.userId},{$set:{'currencies.$.balance':data}},{new:true})//INR given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Ask.volume.currency,Ask.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(currentBid.volume.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$set:{'currencies.$.freezeBalance':data}},{new:true})//inr given to buyer
								.then((success)=>{cb(null,success)})
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Ask.amount.currency,Ask.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(currentBid.amount.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':Ask.amount.currency,userId:Ask.user_id},{$set:{'currencies.$.balance':data}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
							Order.update({_id:currentBid._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date().getTime()},{new:true})
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
									Ask.volume.value = remainingVolume;
									Ask.amount.value = remainingAmount;
									Order.findOne({rate:Ask.rate,'volume.currency':Ask.volume.currency,'amount.currency':Ask.amount.currency,type:'BID',status:false,isCancel:false}).sort({createdAt:-1})
									.then((response)=>{
										if(response)
											trade();
										else
										{
											
										let amount = remainingAmount;
										let volume = remainingVolume
										var market = Ask.amount.currency+'/'+Ask.volume.currency;
										Order.create({status:false,'amount.currency':Ask.amount.currency,'amount.value':amount,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':volume,type:'ASK',userId:Ask.user_id,createdAt:new Date().getTime(),market:market,total_amount:amountOfInitialAsk,total_volume:volumeOfInitialAsk})
										.then((success)=>callback(null,success,'Your Ask placed successfully.'))
										.catch((unsuccess)=>callback(unsuccess))
										}
									})
								}
							})
					}
					else
					{
						Async.waterfall([
							function(cb)
							{
								findData(currentBid.amount.currency,currentBid.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(Ask.amount.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':currentBid.amount.currency,userId:currentBid.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//BTC taken from buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(currentBid.volume.currency,currentBid.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(Ask.volume.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':currentBid.volume.currency,userId:currentBid.userId},{$set:{'currencies.$.balance':data}},{new:true})//INR given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Ask.volume.currency,Ask.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(Ask.volume.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$set:{'currencies.$.freezeBalance':data}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Ask.amount.currency,Ask.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(Ask.amount.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':Ask.amount.currency,userId:Ask.user_id},{$set:{'currencies.$.balance':data}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
							var market = Ask.amount.currency+'/'+Ask.volume.currency;
								Order.create({status:true,'amount.currency':Ask.amount.currency,'amount.value':0,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':0,type:'ASK',userId:Ask.user_id,createdAt:new Date().getTime(),processedAt:new Date().getTime(),market:market,total_amount:Ask.amount.value,total_volume:Ask.volume.value})
								.then((successed)=>{return cb(null,successed)})
								.catch((unsuccessed)=>{console.log("unsuccessed::::     ",unsuccessed);
									return cb(unsuccessed)})
							},
							function(success,cb)
							{
								cbv = new BigNumber(currentBid.amount.value);
								let amount = cbv.minus(Ask.amount.value);
								cvv = new BigNumber(currentBid.volume.value);
								let volume = cvv.minus(Ask.volume.value);
								parseFloat(amount)
								parseFloat(volume)
								Order.update({_id:currentBid._id},{$set:{'amount.value':amount,'volume.value':volume,isEngage:false}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									return callback(err);
								else
									{
									return callback(null,success,'Your Ask placed successfully.');
								}
							})
					}
				}
					else
					{
						var market = Ask.amount.currency+'/'+Ask.volume.currency;
						Order.create({status:false,'amount.currency':Ask.amount.currency,'amount.value':Ask.amount.value,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':Ask.volume.value,type:'ASK',userId:Ask.user_id,createdAt:new Date().getTime(),market:market,total_amount:Ask.amount.value,total_volume:Ask.volume.value})
						.then((success)=>callback(null,success,'Your Ask placed successfully.'))
						.catch((unsuccess)=>callback(unsuccess))
					}
					})
					
				}
	}

})
.catch((unsuccess)=>{callback(unsuccess);})
}

let exchangeBid = (Bid,User,userCurrency,callback)=>{
	// let amountCurrencyValue = currencyData.currencyData[Bid.amount.currency]
	// let volumeCurrencyValue = currencyData.currencyData[Bid.volume.currency]
	Market.findOne()
    .then((data) => {
    if((Bid.volume.value*Bid.rate) != Bid.amount.value)
    {
		let err = {}
		err.message = "Please do not try with fake values."
		return callback(err)
	}
 	var amountCurrencyValue = data.currencyData.find((element)=>{return element.currency == Bid.amount.currency});
	var volumeCurrencyValue = data.currencyData.find((element)=>{return element.currency == Bid.volume.currency});
	let fee = new BigNumber(Bid.amount.value)
	let percent = (fee.multipliedBy(.001))
	percent = new BigNumber(percent)
	fee = percent.plus(fee);
	fee = parseFloat(fee);
	fz = new BigNumber(userCurrency.freezeBalance)
	bln = new BigNumber(userCurrency.balance)
	dec = fz.plus(Bid.amount.value)
	inc = bln.minus(fee)
	parseFloat(dec);
	parseFloat(inc);
	if(fee > userCurrency.balance)
	{
		let err = {}
		err.message = "Sorry, you don't have sufficient amount for this Bid."
		return callback(err)
	}
	else
	{
		Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$set:{'currencies.$.freezeBalance':dec,'currencies.$.balance':inc}},{new:true})//INR taken from seller
		.then((success)=>console.log("  "))
		.catch((unsuccess)=>{return callback(unsuccess)})
				let volumeOfInitialBid = Bid.volume.value
				let amountOfInitialBid = Bid.amount.value
			 	tradeBid();
				async function tradeBid(){
					Order.findOneAndUpdate({rate:Bid.rate,'volume.currency':Bid.volume.currency,'amount.currency':Bid.amount.currency,type:'ASK',status:false,isCancel:false,isEngage:false},{$set:{isEngage:true}},{new:true}).sort({createdAt:-1})
					.then((currentAsk)=>{
						if(currentAsk)
						{
					let remainingVolume = BigNumber(Bid.volume.value).minus(currentAsk.volume.value);
					let remainingAmount = BigNumber(Bid.amount.value).minus(currentAsk.amount.value);
					// console.log()
					if(remainingVolume == 0)
					{
						Async.waterfall([
							function(cb)
							{
								findData(currentAsk.volume.currency,currentAsk.userId,function(err,response)
								{
									if(response)
									{
									x = new BigNumber(response.freezeBalance)
									data = x.minus(Bid.volume.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//INR taken from seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(currentAsk.amount.currency,currentAsk.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									Bid.amount.value = new BigNumber(Bid.amount.value);
									data = x.plus(Bid.amount.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$set:{'currencies.$.balance':data}},{new:true})//btc given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Bid.volume.currency,Bid.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(currentAsk.volume.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$set:{'currencies.$.balance':data}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Bid.amount.currency,Bid.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(currentAsk.amount.value) 
							        console.log(parseFloat(data))
							       Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$set:{'currencies.$.freezeBalance':data}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
							},
							function(success,cb)
							{
								var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':0,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':0,type:'BID',userId:Bid.user_id,createdAt:new Date().getTime(),processedAt:new Date().getTime(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							Order.update({_id:currentAsk._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date().getTime()},{new:true})
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
									// Bid.volume.value = new BigNumber(Bid.volume.value)
									// Bid.volume.value =  Bid.volume.value.minus(currentAsk.volume.value);
									// Bid.amount.value = new BigNumber(Bid.amount.value)
									// Bid.amount.value = Bid.amount.value.minus(currentAsk.amount.value);
									// console.log("1,2::::    ",Bid.volume.value,Bid.amount.value)
									callback(null,success,'Your Bid executed successfully.')
								}

							})

					}
					else if(remainingVolume>0)
					{
						console.log("in >>>>>>>>>>>>>>>>>>>    00000000")
						Async.waterfall([
							function(cb)
							{
								findData(currentAsk.volume.currency,currentAsk.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(currentAsk.volume.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//INR taken from seller
								.then((success)=>{
									cb(null,success)})
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(currentAsk.amount.currency,currentAsk.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(currentAsk.amount.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$set:{'currencies.$.balance':data}},{new:true})//btc given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Bid.volume.currency,Bid.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(currentAsk.volume.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$set:{'currencies.$.balance':data}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Bid.amount.currency,Bid.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(currentAsk.amount.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$set:{'currencies.$.freezeBalance':data}},{new:true})//btc taken from buyer	
								.then((success)=>{
									
									cb(null,success)})
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
							Order.update({_id:currentAsk._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date().getTime()},{new:true})
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
									bvv = new BigNumber(Bid.volume.value)
									Bid.volume.value =  bvv.minus(currentAsk.volume.value);
									bav = new BigNumber(Bid.amount.value)
									Bid.amount.value = bav.minus(currentAsk.amount.value);
									parseFloat(Bid.amount.value)
									parseFloat(Bid.volume.value)
									Order.findOne({rate:Bid.rate,'volume.currency':Bid.volume.currency,'amount.currency':Bid.amount.currency,type:'ASK',status:false,isCancel:false}).sort({createdAt:-1})
									.then((result)=>{
										if(result)
											tradeBid();
										else
										{
										let amount = remainingAmount;
										let volume = remainingVolume;
										var market = Bid.amount.currency+'/'+Bid.volume.currency;
										Order.create({status:false,'amount.currency':Bid.amount.currency,'amount.value':amount,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':volume,type:'BID',userId:Bid.user_id,createdAt:new Date().getTime(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
										.then((success)=>{return callback(null,success,'Your Bid placed successfully.')})
										.catch((unsuccess)=>{return callback(unsuccess)})
										}
									})
								
								}
							})
					}
					else
					{
						Async.waterfall([
							function(cb)
							{
								findData(currentAsk.volume.currency,currentAsk.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(Bid.volume.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//INR taken from seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(currentAsk.amount.currency,currentAsk.userId,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(Bid.amount.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$set:{'currencies.$.balance':data}},{new:true})//btc given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Bid.volume.currency,Bid.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.balance)
									data = x.plus(Bid.volume.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$set:{'currencies.$.balance':data}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
								findData(Bid.amount.currency,Bid.user_id,function(err,response)
								{
									if(response)
									{
									x = BigNumber(response.freezeBalance)
									data = x.minus(Bid.amount.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$set:{'currencies.$.freezeBalance':data}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
							var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':0,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':0,type:'BID',userId:Bid.user_id,createdAt:new Date().getTime(),processedAt:new Date().getTime(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
								.then((success)=>{return cb(null,success)})
								.catch((unsuccess)=>{return cb(unsuccess)})
							},
							function(success,cb)
							{
									cav = new BigNumber(currentAsk.amount.value)
									let amount =  cav.minus(Bid.amount.value);
									cvv = new BigNumber(currentAsk.volume.value)
									let volume = cvv.minus(Bid.volume.value);
									parseFloat(amount)
									parseFloat(volume)
								// let amount = currentAsk.amount.value - Bid.amount.value;
								// let volume = currentAsk.volume.value - Bid.volume.value
								Order.update({_id:currentAsk._id},{$set:{'amount.value':amount,'volume.value':volume,isEngage:false}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									return callback(err);
								else
									return callback(null,success,'Your Bid placed successfully.');
							})
					}
						}
						else
						{
								var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:false,'amount.currency':Bid.amount.currency,'amount.value':Bid.amount.value,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':Bid.volume.value,type:'BID',userId:Bid.user_id,createdAt:new Date().getTime(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
								.then((success)=>{return callback(null,success,'Your Bid placed successfully.')})
								.catch((unsuccess)=>{
									console.log("unsuccess:::   ",unsuccess)
									return callback(unsuccess)})
						}
					})
					.catch((unsuccess)=>{console.log("unsuccess::   ",unsuccess)
							return callback(unsuccess)})

				}			
	}

})
.catch((unsuccess)=>{callback(unsuccess);})	
}
module.exports = {
	exchangeAsk:exchangeAsk,
	exchangeBid:exchangeBid
}