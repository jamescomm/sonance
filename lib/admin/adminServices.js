const User = require('../user/user');
const resHndlr = require("../global/Responder");
const RuleBook = require('./ruleBook');

module.exports = {
	'signupSwitch':(req,res)=>{
		if(req.query.signup == true || req.query.signup == false || req.query.signup == "true" || req.query.signup == "false")
		RuleBook.update({},{signup:req.query.signup},{multi:req.query.signup})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'exchangeSwitch':(req,res)=>{
		if(req.query.exchange == true || req.query.exchange == false || req.query.exchange == "true" || req.query.exchange == "false")
		RuleBook.update({},{exchange:req.query.exchange},{multi:req.query.exchange})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'withdrawSwitchOn':(req,res)=>{
		req.query.currency = req.query.currency.toUpperCase()
		if(req.query.currency)
		RuleBook.update({},{$pull:{withdraw:req.query.currency}},{new:true})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'withdrawSwitchOff':(req,res)=>{
		req.query.currency = req.query.currency.toUpperCase()
		if(req.query.currency)
			RuleBook.findOne()
		.then((result)=>{
			if(result)
			if(result.withdraw.indexOf(req.query.currency)<0)
			RuleBook.update({},{$push:{withdraw:req.query.currency}},{new:true})
			.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200)})
			.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
			else
				return resHndlr.apiResponder(req, res,'You have already performed this action.' , 500)
			else
				return resHndlr.apiResponder(req, res,'We are in the maintinance mode.' , 500)
		})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	}
}