const User = require('../user/user');
const Constants = require('../constants');
const Currencies = require('../currency/dynamicCurrency');
const mongoose = require('mongoose');
let isUserExsist = function(user_id,callback)
{
	if(user_id)
	{
		User.findOne({_id:user_id})
		.then((response)=>{
			if(response)
				callback(null,response);
			else
				callback('Constants.NoDataFound',null)
		})
		.catch((unsuccess)=>{
				callback(unsuccess);
		})
	}
}
let isAddressExsist = function(user_id,currency,callback)
{	
	// user_id = mongoose.Types.ObjectId("5a5efea19e88792876bf71b5");
	Currencies.findOne({userId:user_id})
				.then((resultOFCurrency)=>{
					console.log("resultOFCurrency:  ",resultOFCurrency,resultOFCurrency.currencies.length)
					if(resultOFCurrency)
					{
						let i = 0
						for(i; i<resultOFCurrency.currencies.length ; i++)
							if(resultOFCurrency.currencies[i].currency == currency && resultOFCurrency.currencies[i].address)
								return callback(null,resultOFCurrency.currencies[i]);
						if(i>=resultOFCurrency.currencies.length)
							return callback(null,false)
					}
					else
					{
						return callback('No Data Found for this user.')//create user account in currency collection than create address
					}
				})
				.catch((unsuccess)=>{console.log("unsuccess:  ",unsuccess);callback('Something went wrong.')})
}
module.exports = {
	isUserExsist:isUserExsist,
	isAddressExsist:isAddressExsist
}