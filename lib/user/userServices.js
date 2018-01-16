const User = require('../user/user');
const Constants = require('./userConstants');
const Currencies = require('../currency/dynamicCurrency');
const globalFunction = require('../global/globalFunctions');
const Responder = require('../global/Responder');



module.exports = {
	'createUser':(req)=>{// just a demo api not for use
		return User.create({'email':req.body.email})
	}
}