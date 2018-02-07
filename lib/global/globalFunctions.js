const User = require('../user/user');
const Constants = require('../constants');
const Currencies = require('../currency/currencies');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const UserConstant = require('../user/userConstants')
let isUserExsist = function(user_id,callback)
{
	if(user_id)
	{
		// console.log(typeof user_id, user_id)
		user_id = mongoose.Types.ObjectId(user_id);
		User.findOne({_id:user_id}).populate('balance').exec()
		.then((response)=>{
			// console.log("response in isUserExsist ",response)
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
					// console.log("resultOFCurrency ",resultOFCurrency)
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
let sendMail = (to,subject,text,callback)=>
{
nodemailer.createTestAccount((err, account) => {

 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: 'ebriks.manish@gmail.com',
		pass: 'm@nish2018'
}
    })
let mailOptions = {
      from: 'ebriks.manish@gmail.com', // sender address
      to: to, // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
       html: UserConstant.VERIFY_EMAIL // html body
}
 transporter.sendMail(mailOptions, (error, info) => {
      if (error) 
          return callback(err);
      else
      	return callback(null,info);
      console.log(info);
})
})
}
module.exports = {
	isUserExsist:isUserExsist,
	isAddressExsist:isAddressExsist,
	updateBalanceInDb:updateBalanceInDb,
	sendMail:sendMail
}
