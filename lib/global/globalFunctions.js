const User = require('../user/user');
const Constants = require('../constants');
const Currencies = require('../currency/currencies');
const mongoose = require('mongoose');
let isUserExsist = function(user_id,callback)
{
	if(user_id)
	{
		console.log(typeof user_id, user_id)
		user_id = mongoose.Types.ObjectId(user_id);
		User.findOne({_id:user_id})
		.then((response)=>{
			if(response)
				callback(null,response);
			else
				callback(Constants.MESSAGES.userNotFound,null)
		})
		.catch((unsuccess)=>{
				callback(unsuccess);
		})
	}
}

let isAddressExsist = function(user_id,currency,callback)
{	
	function isBelowThreshold(currentValue) {
  return (currentValue.currency != currency && !currentValue.address)
}
	Currencies.findOne({userId:user_id})
				.then((resultOFCurrency)=>{
					console.log("resultOFCurrency ",resultOFCurrency)
					if(resultOFCurrency)
					{
						if(resultOFCurrency.currencies.every(isBelowThreshold))
							return callback(null,false)
						else
						{
							var found = resultOFCurrency.currencies.find((element)=>{return element.currency == currency});
							return callback(null,found);
						}
					}
					else
						return callback('No Data Found for this user.')//create user account in currency collection than create address
				})
				.catch((unsuccess)=>{console.log("unsuccess:  ",unsuccess);callback('Something went wrong.')})
}
let updateBalanceInDb = function(user_id,currency,amountToUpdate,callback){
	Currencies.findOneAndUpdate({'currencies.currency':currency,userId:user_id},{'currencies.$.balance':amountToUpdate},{new:true})
	.then((response)=>{
		if(response)
		{
			var found = response.currencies.find((element)=>{return element.currency == currency});
							return callback(null,found);
		}
		else
		{
			callback('Something went wrong',null);
		}
	})
	.catch((unsuccess)=>{return callback(unsuccess);})
}
module.exports = {
	isUserExsist:isUserExsist,
	isAddressExsist:isAddressExsist,
	updateBalanceInDb:updateBalanceInDb
}