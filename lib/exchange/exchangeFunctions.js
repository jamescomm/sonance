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
		return callback("Sorry, you don't have sufficient amount for this Ask.")
	else
	{
		Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$inc:{'currencies.$.freezeBalance':Ask.volume.value,'currencies.$.balance':-Ask.volume.value}},{new:true})//INR taken from seller
		.then((success)=>console.log("User Ask balance updated initialy : "))
		.catch((unsuccess)=>callback(unsuccess))
		Order.find({'volume.currency':Ask.volume.currency,'amount.currency':Ask.amount.currency,type:'BID',status:false,rate:Ask.rate}).sort({createdAt:-1})
		.then((successed)=>{
			console.log("successed: ",successed)
			let volumeOfInitialAsk = Ask.volume.value
			let amountOfInitialAsk = Ask.amount.value
			if(successed.length)
			{ let counter = 0;
				Async.forEachLimit(successed,1,(currentBid,next)=>{
					counter++;
					let remainingVolume = Ask.volume.value - currentBid.volume.value;
					let remainingAmount = Ask.amount.value - currentBid.amount.value;
					if(remainingVolume == 0)
					{console.log("in ask when == 0")
						Async.waterfall([
							function(cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentBid.amount.currency,userId:currentBid.userId},{$inc:{'currencies.$.freezeBalance':-Ask.amount.value}},{new:true})//BTC taken from buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentBid.volume.currency,userId:currentBid.userId},{$inc:{'currencies.$.balance':Ask.volume.value}},{new:true})//INR given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$inc:{'currencies.$.freezeBalance':-currentBid.volume.value}},{new:true})//inr taken from buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Ask.amount.currency,userId:Ask.user_id},{$inc:{'currencies.$.balance':currentBid.amount.value}},{new:true})//btc given to buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var market = Ask.amount.currency+'/'+Ask.volume.currency;
								Order.create({status:true,'amount.currency':Ask.amount.currency,'amount.value':0,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':0,type:'Ask',userId:Ask.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:amountOfInitialAsk,total_volume:volumeOfInitialAsk})
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
									Ask.volume.value = Ask.volume.value - currentBid.volume.value;
									Ask.amount.value = Ask.amount.value - currentBid.amount.value;
									callback(null,success)
								}

							})

					}
					else if(remainingVolume>0)
					{ console.log("in greater Ask function")
						Async.waterfall([
							function(cb)
							{
								var amountTakenFromBidder = Ask.amount.value - remainingAmount;//bcz remainingAmount is +ve
								console.log("amountTakenFromBidder:  ",amountTakenFromBidder)
								Currencies.findOneAndUpdate({'currencies.currency':currentBid.amount.currency,userId:currentBid.userId},{$inc:{'currencies.$.freezeBalance':-amountTakenFromBidder}},{new:true})//BTC taken from buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var volumeGivenTOBidder = Ask.volume.value - remainingVolume; //bcz remainingVolume is +ve
								console.log("volumeGivenTOBidder:  ",volumeGivenTOBidder)
								Currencies.findOneAndUpdate({'currencies.currency':currentBid.volume.currency,userId:currentBid.userId},{$inc:{'currencies.$.balance':volumeGivenTOBidder}},{new:true})//INR given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$inc:{'currencies.$.freezeBalance':-currentBid.volume.value}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':Ask.amount.currency,userId:Ask.user_id},{$inc:{'currencies.$.balance':currentBid.amount.value}},{new:true})//btc taken from buyer	
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
								Order.create({status:false,'amount.currency':Ask.amount.currency,'amount.value':amount,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':volume,type:'Ask',userId:Ask.user_id,createdAt:new Date(),market:market,total_amount:amountOfInitialAsk,total_volume:volumeOfInitialAsk})
								.then((success)=>callback(null,success))
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
								Currencies.findOneAndUpdate({'currencies.currency':currentBid.amount.currency,userId:currentBid.userId},{$inc:{'currencies.$.freezeBalance':-Ask.amount.value}},{new:true})//BTC taken from buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								Currencies.findOneAndUpdate({'currencies.currency':currentBid.volume.currency,userId:currentBid.userId},{$inc:{'currencies.$.balance':Ask.volume.value}},{new:true})//INR given to seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var volumeGivenTOBidder = currentBid.volume.value + remainingVolume; //bcz remainingVolume is -ve
								console.log("volumeGivenTOBidder:  ",volumeGivenTOBidder)
								Currencies.findOneAndUpdate({'currencies.currency':Ask.volume.currency,userId:Ask.user_id},{$inc:{'currencies.$.freezeBalance':-volumeGivenTOBidder}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var amountTakenFromBidder = currentBid.amount.value + remainingAmount;//bcz remainingAmount is -ve
								console.log("amountTakenFromBidder:  ",amountTakenFromBidder)
								Currencies.findOneAndUpdate({'currencies.currency':Ask.amount.currency,userId:Ask.user_id},{$inc:{'currencies.$.balance':amountTakenFromBidder}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
							var market = Ask.amount.currency+'/'+Ask.volume.currency;
								Order.create({status:true,'amount.currency':Ask.amount.currency,'amount.value':0,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':0,type:'Ask',userId:Ask.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:Ask.amount.value,total_volume:Ask.volume.value})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								let amount = currentBid.amount.value - Ask.amount.value;
								let volume = currentBid.volume.value - Ask.volume.value
								Order.update({_id:currentBid._id},{$set:{'amount.value':amount,'volume.value':volume}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									callback(err);
								else
									callback(null,success);
							})
					}
				})
			}
			else
			{
				var market = Ask.amount.currency+'/'+Ask.volume.currency;
				// Order.create({amount:Ask.amount,rate:Ask.rate,volume:Ask.volume,type:'Ask',userId:Ask.user_id,createdAt:new Date(),market:market})
				Order.create({status:false,'amount.currency':Ask.amount.currency,'amount.value':Ask.amount.value,rate:Ask.rate,'volume.currency':Ask.volume.currency,'volume.value':Ask.volume.value,type:'Ask',userId:Ask.user_id,createdAt:new Date(),market:market,total_amount:Ask.amount.value,total_volume:Ask.volume.value})
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
		.catch((unsuccess)=>{return callback(unsuccess)})
		Order.find({'volume.currency':Bid.volume.currency,'amount.currency':Bid.amount.currency,type:'Ask',status:false,rate:Bid.rate}).sort({createdAt:-1})
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
								var volumeGivenTOBidder = Bid.volume.value - remainingVolume; //bcz remainingVolume is +ve
								console.log("volumeGivenTOBidder:  ",volumeGivenTOBidder)
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.volume.currency,userId:currentAsk.userId},{$inc:{'currencies.$.freezeBalance':-volumeGivenTOBidder}},{new:true})//INR taken from seller
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var amountTakenFromBidder = Bid.amount.value - remainingAmount;//bcz remainingAmount is +ve
								console.log("amountTakenFromBidder:  ",amountTakenFromBidder)
								Currencies.findOneAndUpdate({'currencies.currency':currentAsk.amount.currency,userId:currentAsk.userId},{$inc:{'currencies.$.balance':amountTakenFromBidder}},{new:true})//btc given to seller
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
									Bid.volume.value = Bid.volume.value - currentAsk.volume.value;
									Bid.amount.value = Bid.amount.value - currentAsk.amount.value;
									if(counter<successed.length)
									next();
								else
								{
								let amount = remainingAmount;
								let volume = remainingVolume;
								var market = Bid.amount.currency+'/'+Bid.volume.currency;
								Order.create({status:false,'amount.currency':Bid.amount.currency,'amount.value':amount,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':volume,type:'BID',userId:Bid.user_id,createdAt:new Date(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
								.then((success)=>callback(null,success))
								.catch((unsuccess)=>callback(unsuccess))
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
								var volumeGivenTOBidder = currentAsk.volume.value + remainingVolume; //bcz remainingVolume is -ve
								console.log("volumeGivenTOBidder:  ",volumeGivenTOBidder)
								Currencies.findOneAndUpdate({'currencies.currency':Bid.volume.currency,userId:Bid.user_id},{$inc:{'currencies.$.balance':volumeGivenTOBidder}},{new:true})//inr given to buyer
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							},
							function(success,cb)
							{
								var amountTakenFromBidder = currentAsk.amount.value + remainingAmount;//bcz remainingAmount is -ve
								console.log("amountTakenFromBidder:  ",amountTakenFromBidder)
								Currencies.findOneAndUpdate({'currencies.currency':Bid.amount.currency,userId:Bid.user_id},{$inc:{'currencies.$.freezeBalance':-amountTakenFromBidder}},{new:true})//btc taken from buyer	
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
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
								let amount = currentAsk.amount.value - Bid.amount.value;
								let volume = currentAsk.volume.value - Bid.volume.value
								Order.update({_id:currentAsk._id},{$set:{'amount.value':amount,'volume.value':volume}},{new:true})
								.then((success)=>cb(null,success))
								.catch((unsuccess)=>cb(unsuccess))
							}
							],
							function(err,success)
							{
								if(err)
									callback(err);
								else
									callback(null,success);
							})
					}
				})
			}
			else
			{
				console.log("in else for place bid")
				var market = Bid.amount.currency+'/'+Bid.volume.currency;
				// Order.create({amount:Bid.amount,rate:Bid.rate,volume:Bid.volume,type:'BID',userId:Bid.user_id,createdAt:new Date(),market:market})
				Order.create({status:true,'amount.currency':Bid.amount.currency,'amount.value':Bid.amount.value,rate:Bid.rate,'volume.currency':Bid.volume.currency,'volume.value':Bid.volume.value,type:'BID',userId:Bid.user_id,createdAt:new Date(),processedAt:new Date(),market:market,total_amount:amountOfInitialBid,total_volume:volumeOfInitialBid})
				.then((success)=>{return callback(null,success)})
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