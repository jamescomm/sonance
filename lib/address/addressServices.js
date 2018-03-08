// *********************requiring necessary modules******************
const bitcoin = require('bitcoin');
// const client = new bitcoin.Client({
//   host: '192.64.116.199',
//   port: 18332,
//   user: 'test',
//   pass: 'test123'
// });
const Credential = require('../config/env/credentials');
const User = require('../user/user');
const Constants = require('./addressConstants');
const Market = require('./market');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require('../global/Responder');
const currencyData = require('./currencyData');
var Accounts = require('web3-eth-accounts');
var Personal = require('web3-eth-personal');
var Web3 = require('web3');
var accounts = new Accounts('ws://192.168.0.130:8546');
var personal = new Personal('ws://192.168.0.130:8546');
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.130:8546'));
//****************************required functions************************ 
let bitAddress = (client,req,res,currencyValue,labelWithPrefix)=>{

	    client.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
				      	if(err)
				      	{
				      		console.log("in get new address")
				      		return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
				      	}
				      	else
				      	{
				      		var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
				      		Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
				      		.then((success)=>{
				      			var found = success.currencies.find(function(element) {
									  return element.currency == currencyValue.currency;
									});
				      			return resHndlr.apiResponder(req,res,"Address generated successfully",200,found)
				      		})
				      		.catch((unsuccess)=>{
				      			return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
				      		})
				      	}
				      })
}
let ethAddress = (req,res,currencyValue)=>{
	    web3.eth.personal.newAccount(req.body.user_id,(err,address) => {
				      	if(err)
				      	{
				      		console.log("in get new address",err)
				      		return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
				      	}
				      	else
				      	{
				      		console.log("address::: ",address)
				      		var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
				      		Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
				      		.then((success)=>{
				      			var found = success.currencies.find(function(element) {
									  return element.currency == currencyValue.currency;
									});
				      			return resHndlr.apiResponder(req,res,"Address generated successfully",200,found)
				      		})
				      		.catch((unsuccess)=>{
				      			return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
				      		})
				      	}
				      })
}
let xrpAddress = (req,res,currencyValue)=>{
var address = '';
var otppossible = "1234567890";
var i = 0;
	for (; i < 9; i++) {
	address += otppossible.charAt(Math.floor(Math.random() * otppossible.length));
	};
			if(i>=9)
			{
      		console.log("address::: ",address)
      			var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
		      		Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
		      		.then((success)=>{
		      			var found = success.currencies.find(function(element) {
							  return element.currency == currencyValue.currency;
							});
		      			return resHndlr.apiResponder(req,res,"Address generated successfully",200,found)
		      		})
		      		.catch((unsuccess)=>{
		      			return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
		      		})
      	}
}
//*******************************API's********************************
module.exports = {
	'genAddress':(req,res)=>
	{
		Credential.findOne({})
		.then((credential)=>{
			credential = credential[req.body.currency.toUpperCase()];
			index = Math.ceil(req.body.identity/1000);
			if(credential[index])
			var client = new bitcoin.Client({
			  host: credential[index].host,
			  port: credential[index].port,
			  user: credential[index].user,
			  pass: credential[index].pass
			});
		else
			return resHndlr.apiResponder(req,res,'Sorry not able to generate your addresses,due to heavy server load.',500)
		
		req.body.currency = req.body.currency.toUpperCase();
		Market.findOne({'currencyData.currency': req.body.currency}, {'currencyData.$': 1})
    .then((data) => {
        let currencyValue = data.currencyData[0]
		console.log("currencyValue: ",currencyValue,req.body.user_id)
		 globalFunction.isUserExsist(req.body.user_id,function(err,response){
			if(err)
				return resHndlr.apiResponder(req,res,"Something went wrong",500,err)
			else
				globalFunction.isAddressExsist(response._id,currencyValue.currency,function(err,result){
					if(err)
						return resHndlr.apiResponder(req,res,err,500,err)
					else if(result)
						return resHndlr.apiResponder(req,res,"Address already exsist",500,result)
					else if(!err && !result)
					{
					var labelWithPrefix = 'LABELPREFIX' + req.body.user_id;
					console.log("req.body.currency :" ,req.body.currency)
				  if(req.body.currency == 'ETH')
				  {
				  	console.log("1")
				  	return ethAddress(req,res,currencyValue);
				  }
				  else if(req.body.currency == 'XRP')
				  {
				  	console.log("2")
				  	return xrpAddress(req,res,currencyValue);
				  }
				  else
				  {console.log("3")
				  	return bitAddress(client,req,res,currencyValue,labelWithPrefix);
				  }

					}
				})
		})
		})
    })
.catch((unsuccess)=>{return resHndlr.apiResponder(req,res,"Something went wrong",500,unsuccess)})
	},
	'marketData' : (req, res)=>{
	Market.find({}, function(err, response){
	if(err)
		  return resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
		else
          return resHndlr.apiResponder(req, res, 'User Profile.', 200,response)
	})
}



}