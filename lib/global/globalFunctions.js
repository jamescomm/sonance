const User = require('../user/user');
const Constants = require('../constants');
const Currencies = require('../currency/dynamicCurrency');

let isUserExsist = function(userMailId,callback)
{
	if(userMailId)
	{
		User.findOne({email:userMailId})
		.then((response)=>{
			if(response)
				callback(null,response);
			else
				callback('Constants.NoDataFound',null)
		})
		.catch(()=>{

		})
	}
}
let isAddressExsist = function(user_id,currency,callback)
{
	Currencies.findOne({userId:user_id,})
				.then((resultOFCurrency)=>{
					if(resultOFCurrency.currencies.length >=0)
					{
					resultOFCurrency.currencies.filter((obj)=>{
							if(obj.name == currency)
								if(obj.address)
									callback(null,obj.address);
						})
					}
					else
					{
						callback('Constants.NoDataFound',null)
					}
				})
}
module.exports = {
	isUserExsist:isUserExsist,
	isAddressExsist:isAddressExsist
}