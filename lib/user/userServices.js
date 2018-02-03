const User = require('../user/user');
const Constants = require('./userConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const Order = require('../exchange/order');
const resHndlr = require("../global/Responder");

module.exports = {
	'createUser':(req,res)=>{// just a demo api not for use

		return User.create({'email':req.body.email})
	},
	'userCurrency':(user_id)=>{ //entry in currency collection
		return Currencies.create({userId:user_id})
	},
	'userTradeMarket':(req,res)=>{
		if(!req.body.user_id || !req.body.page || !req.body.type)	//user_id/page/sort/status/type
			resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
		{
			req.body.type = req.body.type.toUpperCase();
			if(req.body.sort)// need to be static for sure
			{
				var value = req.body.sort;
				var option = { page: req.body.page, limit: Constants.MESSAGES.Limit, sort:{value : -1},lean:true}
			}
			else
				var option = { page: req.body.page, limit: Constants.MESSAGES.Limit, sort: {createdAt : -1},lean:true}
			if(req.body.status == true)
				var query = {userId:req.body.user_id,type:req.body.type,status:true}
			else if(req.body.status == false)
				var query = {userId:req.body.user_id,type:req.body.type,status:false}
			else
				var query = {userId:req.body.user_id,type:req.body.type}
			console.log(query,option)
			Order.paginate(query,option,(error,result)=>{
				if(error)
					resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
				else
					resHndlr.apiResponder(req, res, Constants.MESSAGES[req.body.type], 200,result)
				})
		}
	},
	'userTrades':(req,res)=>{
		if(!req.body.user_id || !req.body.page)		//user_id/page/sort/status
			resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
		{
			if(req.body.sort)// need to be static for sure like :processedAt/rate/total_amount/total_volume
			{
				var value = req.body.sort;
				var option = { page: req.body.page, limit: Constants.MESSAGES.Limit, sort:{value : -1},lean:true}
			}
			else
				var option = { page: req.body.page, limit: Constants.MESSAGES.Limit, sort: {createdAt : -1},lean:true}
			if(req.body.status == true)
				var query = {userId:req.body.user_id,status:true}
			else if(req.body.status == false)
				var query = {userId:req.body.user_id,status:false}
			else
				var query = {userId:req.body.user_id}
			Order.paginate(query,option,(error,result)=>{
				if(error)
					resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
				else
					resHndlr.apiResponder(req, res, Constants.MESSAGES.Data, 200,result)
				})
		}
	},
	'userBalance':(req,res)=>{
		// console.log(req)
		if(!req.query)
		resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
		{
		Currencies.findOne({userId:req.query['user_id']})
		.then((success)=>{
			resHndlr.apiResponder(req, res, Constants.MESSAGES.Data, 200,success)
		})
		.catch((unsuccess)=>{
			console.log(unsuccess)
			resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
		})
	}
	},
	'userCurrencyBalance':(req,res)=>{
		// console.log(req)
		if(!req.query)
		resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
		{
		Currencies.findOne({userId:req.query['user_id'],'currencies.currency':req.query['currency']},{'currencies.$':1})
		.then((success)=>{
			resHndlr.apiResponder(req, res, Constants.MESSAGES.Data, 200,success)
		})
		.catch((unsuccess)=>{
			console.log(unsuccess)
			resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
		})
	}
	}
}