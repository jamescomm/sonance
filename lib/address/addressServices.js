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
const Currencies = require('../currency/dynamicCurrency');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require('../global/Responder');
const currencyData = require('./currencyData');
//****************************required functions************************ 


//*******************************API's********************************
module.exports = {
	'genAddress':(req,res)=>
	{
		let currencyValue = currencyData.currencyData[req.body.currency]
		console.log("currencyValue: ",currencyValue)
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
				      console.log("labelWithPrefix :: " + labelWithPrefix);
				      client.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
				      	if(err)
				      		return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
				      	else
				      	{
				      		var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
				      		Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
				      		.then((success)=>{
				      			return resHndlr.apiResponder(req,res,"Address generated successfully",200,success)
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