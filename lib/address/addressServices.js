// *********************requiring necessary modules******************
const bitcoin = require('bitcoin');
const client = new bitcoin.Client({
  host: '162.213.252.66',
  port: 18336,
  user: 'test',
  pass: 'test123'
});
const User = require('../user/user');
const Constants = require('./addressConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require('../global/Responder');
const currencyData = require('./currencyData');
//****************************required functions************************ 


//*******************************API's********************************
module.exports = {
	'genAddress':(req,res)=>
	{
		req.body.currency = req.body.currency.toUpperCase();
		let currencyValue = currencyData.currencyData[req.body.currency]
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
				})
		})
	}



}