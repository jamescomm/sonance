// *********************requiring necessary modules******************
const bitcoinBTC = require('bitcoin');
const clientBTC = new bitcoinBTC.Client({
  // host: sails.config.company.clientBTChost,
  // port: sails.config.company.clientBTCport,
  // user: sails.config.company.clientBTCuser,
  // pass: sails.config.company.clientBTCpass
});
const User = require('../user/user');
const Constants = require('./addressConstants');
const Currencies = require('../currency/dynamicCurrency');
const globalFunction = require('../global/globalFunctions');
const Responder = require('../global/Responder');

//****************************required functions************************ 


//*******************************API's********************************
module.exports = {
	'genAddress':(req,res)
	{
		globalFunction.isUserExsist(req.body.email,function(err,response){
			if(err)
				'Response'
			else
				globalFunction.isAddressExsist(response._id,currency,function(err,result){
					if(err)
						'Response'
					else if(result)
					{
						Responder.Responder.apiResponder(req, res, "Address for this currency is already exsist.", 200)
					}
					else
					{
						 var labelWithPrefix = LABELPREFIX + userMailId;
				      console.log("labelWithPrefix :: " + labelWithPrefix);
				      clientBTC.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
				      	if(err)
				      		Responder.Responder.apiResponder(req, res, "Something went wrong.", 500)
				      	else
				      	{
				      		Currencies.findOneAndUpdate({userId:response._id},{$push:{currencies:{'country':country,'address':address,'name':name,'currency':currency}}},{new:true})
				      		.then((response)=>{
				      			Responder.Responder.apiResponder(req, res, "User address generated successfully.", 200)
				      		})
				      		.catch((failure)=>{
				      			Responder.Responder.apiResponder(req, res, "Something went wrong.", 200)
				      		})
				      	}
				      })

					}
				})
		})
	}



}