const User = require('../user/user');
const Constants = require('./userConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require("../global/Responder");

module.exports = {
	'createUser':(req,res)=>{// just a demo api not for use

		return User.create({'email':req.body.email})
	},
	'userCurrency':(user_id)=>{ //entry in currency collection
		return Currencies.create({userId:user_id})
	}
}