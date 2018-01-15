const User = require('../user/user');
const Constants = require('./addressConstants');
const Currencies = require('../currency/dynamicCurrency');
const globalFunction = require('../global/globalFunctions');
const Responder = require('../global/Responder');



module.exports = {
	'createUser':(req,res)=>{// just a demo api not for use
		User.create({'email':req.body.email})
		.then((response)=>console.log(response))
		.catch((unsuccess)=>console.log(unsuccess))
	}
}