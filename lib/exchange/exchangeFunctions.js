const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require("../global/Responder");
const Order = require("./order");
const Async = require("async");
const currencyData = require("../address/currencyData");
var BigNumber = require('bignumber.js');
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
	let amountCurrencyValue = currencyData.currencyData[Ask.amount.currency]
	let volumeCurrencyValue = currencyData.currencyData[Ask.volume.currency]
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
		return callback("Sorry, you don't have sufficient amount for this Ask.")
	else
	{
		console.log("fee : :::::::::::::::::::::::     ",fee);
		Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$set:{'currencies.$.freezeBalance':dec,'currencies.$.balance':inc}},{new:true})//INR taken from seller
		.then((success)=>
			console.log("11111111111111111111111 : ", success)
			)
		.catch((unsuccess)=>callback(unsuccess))
		Order.find({rate:Ask.rate,'volume.currency':Ask.volume.currency,'amount.currency':Ask.amount.currency,type:'BID',status:false,isCancel:false}).sort({createdAt:-1})
		.then((successed)=>{
			// console.log("successed: ",successed)
			let volumeOfInitialAsk = Ask.volume.value
			let amountOfInitialAsk = Ask.amount.value
			if(successed.length)
			{ let counter = 0;
				Async.forEachLimit(successed,1,(currentBid,next)=>{
					counter++;
					Ask.volume.value = parseFloat(Ask.volume.value);
					Ask.amount.value = parseFloat(Ask.amount.value);
					currentBid.volume.value = parseFloat(currentBid.volume.value);
					currentBid.amount.value = parseFloat(currentBid.amount.value);
					console.log("a,b:    ",currentBid.amount.value,currentBid.volume.value)
					let remainingVolume =  BigNumber(Ask.volume.value).minus(currentBid.volume.value);
					let remainingAmount =  BigNumber(Ask.amount.value).minus(currentBid.amount.value);
				parseFloat(remainingAmount)
				parseFloat(remainingVolume)
					if(remainingVolume == 0)
					{console.log("in ask when == 0")
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
								Order.create({status:true,'amount.currency':Ask.amount.currency,'amount.value':0,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':0,type:'ASK',userId:Ask.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:amountOfInitialAsk,total_volume:volumeOfInitialAsk})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							Order.update({_id:currentBid._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date()},{new:true})
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
					{ console.log("in greater Ask function")
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
							Order.update({_id:currentBid._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date()},{new:true})
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
									if(counter<successed.length)
									next();
								else
								{
								let amount = remainingAmount;
								let volume = remainingVolume
								var market = Ask.amount.currency+'/'+Ask.volume.currency;
								Order.create({status:false,'amount.currency':Ask.amount.currency,'amount.value':amount,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':volume,type:'ASK',userId:Ask.user_id,createdAt:new Date(),market:market,total_amount:amountOfInitialAsk,total_volume:volumeOfInitialAsk})
								.then((success)=>callback(null,success,'Your Ask placed successfully.'))
								.catch((unsuccess)=>callback(unsuccess))
								}
								}
							})
					}
					else
					{
						console.log("in -ve function :: ")
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
								Order.create({status:true,'amount.currency':Ask.amount.currency,'amount.value':0,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':0,type:'ASK',userId:Ask.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:Ask.amount.value,total_volume:Ask.volume.value})
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
								Order.update({_id:currentBid._id},{$set:{'amount.value':amount,'volume.value':volume}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									return callback(err);
								else
									return callback(null,success,'Your Ask placed successfully.');
							})
					}
				})
			}
			else
			{
				var market = Ask.amount.currency+'/'+Ask.volume.currency;
				// Order.create({amount:Ask.amount,rate:Ask.rate,volume:Ask.volume,type:'Ask',userId:Ask.user_id,createdAt:new Date(),market:market})
				Order.create({status:false,'amount.currency':Ask.amount.currency,'amount.value':Ask.amount.value,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':Ask.volume.value,type:'ASK',userId:Ask.user_id,createdAt:new Date(),market:market,total_amount:Ask.amount.value,total_volume:Ask.volume.value})
				.then((success)=>callback(null,success,'Your Ask placed successfully.'))
				.catch((unsuccess)=>callback(unsuccess))
			}
		})
		.catch(((unsuccess)=>callback(unsuccess)))
			
	}

}

let exchangeBid = (Bid,User,userCurrency,callback)=>{
	let amountCurrencyValue = currencyData.currencyData[Bid.amount.currency]
	let volumeCurrencyValue = currencyData.currencyData[Bid.volume.currency]
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
		return callback("Sorry, you don't have sufficient amount for this Bid.")
	else
	{
		console.log("fee : :::::::::::::::::::::::     ",fee);
		Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$set:{'currencies.$.freezeBalance':dec,'currencies.$.balance':inc}},{new:true})//INR taken from seller
		.then((success)=>console.log("User bid balance updated initialy : ",success))
		.catch((unsuccess)=>{return callback(unsuccess)})
		Order.find({rate:Bid.rate,'volume.currency':Bid.volume.currency,'amount.currency':Bid.amount.currency,type:'ASK',status:false,isCancel:false}).sort({createdAt:-1})
		.then((successed)=>{
				let volumeOfInitialBid = Bid.volume.value
				let amountOfInitialBid = Bid.amount.value
			console.log("successed:  ",successed)
			if(successed.length)
			{
				console.log("in if",successed.length)
			 	let counter = 0;
				Async.forEachLimit(successed,1,(currentAsk,next)=>{
					counter++;
					let remainingVolume = Bid.volume.value - currentAsk.volume.value;
					let remainingAmount = Bid.amount.value - currentAsk.amount.value;
					// console.log()
					if(remainingVolume == 0)
					{
						console.log("in == 00000000")
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
									console.log("response.freezeBalanc: ",Bid.amount.value)
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
								Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':0,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':0,type:'BID',userId:Bid.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							Order.update({_id:currentAsk._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date()},{new:true})
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
									console.log("x:   ",response.freezeBalance,x)
									data = x.minus(currentAsk.volume.value) 
							        console.log(parseFloat(data))
							      Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$set:{'currencies.$.freezeBalance':data}},{new:true})//INR taken from seller
								.then((success)=>{console.log("in successfully", success);
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
									console.log("success:   ",success);
									cb(null,success)})
								.catch((unsuccess)=>cb(unsuccess))
									}
									else
										cb(err)
								})
								
							},
							function(success,cb)
							{
							Order.update({_id:currentAsk._id},{'amount.value':0,'volume.value':0,status:true,processedAt:new Date()},{new:true})
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
									// Bid.volume.value = Bid.volume.value - currentAsk.volume.value;
									// Bid.amount.value = Bid.amount.value - currentAsk.amount.value;
									if(counter<successed.length)
									next();
								else
								{
								let amount = remainingAmount;
								let volume = remainingVolume;
								var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:false,'amount.currency':Bid.amount.currency,'amount.value':amount,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':volume,type:'BID',userId:Bid.user_id,createdAt:new Date(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
								.then((success)=>{return callback(null,success,'Your Bid placed successfully.')})
								.catch((unsuccess)=>{return callback(unsuccess)})
								}
								}
							})
					}
					else
					{
						console.log("in <<<<<<<<<<<<<<<<<< 00000000")
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
								Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':0,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':0,type:'BID',userId:Bid.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
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
								Order.update({_id:currentAsk._id},{$set:{'amount.value':amount,'volume.value':volume}},{new:true})
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
				})
			}
			else
			{
				console.log("in else for place bid")
				var market = Bid.amount.currency+'/'+Bid.volume.currency;
				// Order.create({amount:Bid.amount,rate:Bid.rate,volume:Bid.volume,type:'BID',userId:Bid.user_id,createdAt:new Date(),market:market})
				Order.create({status:false,'amount.currency':Bid.amount.currency,'amount.value':Bid.amount.value,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':Bid.volume.value,type:'BID',userId:Bid.user_id,createdAt:new Date(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
				.then((success)=>{return callback(null,success,'Your Bid placed successfully.')})
				.catch((unsuccess)=>{
					console.log("unsuccess:::   ",unsuccess)
					return callback(unsuccess)})
			}
		})
		.catch(((unsuccess)=>{console.log("unsuccess::   ",unsuccess)
			return callback(unsuccess)}))
			
	}

	
}
module.exports = {
	exchangeAsk:exchangeAsk,
	exchangeBid:exchangeBid
}