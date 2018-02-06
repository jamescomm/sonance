const User = require('../user/user');
const Constants = require('./userConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const Order = require('../exchange/order');
const resHndlr = require("../global/Responder");
const Transactions = require('../transection/transections')
var bcrypt = require('bcrypt');

const accountSid = 'AC84ffcebc0be146ac5015574660bbdb8b';
		const authToken = '1fbb5843000dc4250ea6033e0ad97a6e';
		const client = require('twilio')(accountSid, authToken);
//***************************************function ************************************************
function sendMessage(_id,number,message,callback){
		client.messages.create(
		{
		body: message+OTP,
		to: number,
		from: '+14158141829'
		// mediaUrl: 'http://www.example.com/cheeseburger.png',
		},
		(err, message) => {
		if(err)
		resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
		{
			User.findOneAndUpdate({_id:_id},{$set:{otp:OTP,phone:number}},{new:true})
			.then((success)=>callback(null,'OTP is send on your phone please verify.'))
			.catch((unsuccess)=>callback(Constants.MESSAGES.SomeThingWrong))
		}
		}
		)
		}
//*****************************************APIS***************************************************
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
	},
	'cancelTrade':(req,res)=>
	{
		if(!req.body.order_id || !req.body.user_id)
		{
			resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		}
		else
		{
			Order.update({userId:req.body.user_id,_id:req.body.order_id},{isCancel:true},{new:true})
			.then((success)=>resHndlr.apiResponder(req, res,'Your'+success.type+' cancel successfully.', 200))
			.catch((unsuccess)=>resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400))
		}
	},
	'userTransactions':(req,res)=>{
		let option = { page: req.body.page, limit: Constants.MESSAGES.Limit, sort:{time : -1},lean:true}
		if(!req.body.user_id)
			return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
			Transactions.paginate({userId:req.body.user_id},option)
			.then((success)=>resHndlr.apiResponder(req, res,'Your last five transactions.', 200))
			.catch((unsuccess)=>resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400))
	},
	'sendOtp':(req,res)=>{
		if(!req.body._id || !req.body.number)
			return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
	else
		{
		const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
		const authToken = 'your_auth_token';
		const client = require('twilio')(accountSid, authToken);

		sendMessage(req.body._id,req.body.number,'OTP to verify your phone number:  ',(err, message) => {
		if(err)
		resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
		resHndlr.apiResponder(req, res,'OTP is send on your phone please verify.', 200)
		}
		)
		}		
	},
	'verifyOtp':(req,res)=>{
		if(!req.body._id || !req.body.otp)
			return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
		else
			User.findOne({_id:req.body._id})
			.then((success)=>{
				if(success && success.otp == req.body.otp)
					resHndlr.apiResponder(req, res,'OTP is virified successfully.', 200)
				else
					resHndlr.apiResponder(req, res,'Please provide the correct otp.', 200)
			})
			.catch((unsuccess)=>resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400))
	},
	'forgetPassword':(req,res)=>{

	},
	'changePassword': (req, res) => {
    if (!req.body._id || !req.body.oldPassword || !req.body.newPassword) return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
    else findOne({
        _id: req.body._id
    }).then((success) => {
        bcrypt.compare(req.body.oldPassword, success.password, function(err, isMatch) {
            if (err) resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
            else
            if (isMatch) bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                    if (err) return resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
                    else {
                        success.password = hash;
                        success.save(function(err, result) {
                            if (err) return resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
                            else return resHndlr.apiResponder(req, res, 'Your password updated successfully.', 200)
                        })
                    }
                });
            })
            	else
            		return resHndlr.apiResponder(req, res, 'Please provide correct password.', 200)
        });
    })
}

}