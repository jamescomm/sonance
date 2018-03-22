const User = require('../user/user');
const Constants = require('../constants');
const Currencies = require('../currency/currencies');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const UserConstant = require('../user/userConstants');
const resHndlr = require("../global/Responder");
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
let sendMail = (id,to,subject,text,callback)=>
{
let verificationURL = 'http://199.188.204.100:5001/exchanges/api/v1/user/verifyEmail?userId='+id
nodemailer.createTestAccount((err, account) => {
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: 'cryptoexchange18@gmail.com',
		pass: 'cryptoexchange18@123'
}
    })
let mailOptions = {
      from: 'cryptoexchange18@gmail.com', // sender address
      to: to, // list of receivers
      subject: 'Welcome to sonance!!!', // Subject line
      html: `
                  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                  <html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                  <head>
                    <meta name="viewport" content="width=device-width" />
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <title>Actionable emails e.g. reset password</title>


                    <style type="text/css">
                      img {
                        max-width: 100%;
                      }

                      body {
                        -webkit-font-smoothing: antialiased;
                        -webkit-text-size-adjust: none;
                        width: 100% !important;
                        height: 100%;
                        line-height: 1.6em;
                      }

                      body {
                        background-color: #f6f6f6;
                      }

                      @media only screen and (max-width: 640px) {
                        body {
                          padding: 0 !important;
                        }
                        h1 {
                          font-weight: 800 !important;
                          margin: 20px 0 5px !important;
                        }
                        h2 {
                          font-weight: 800 !important;
                          margin: 20px 0 5px !important;
                        }
                        h3 {
                          font-weight: 800 !important;
                          margin: 20px 0 5px !important;
                        }
                        h4 {
                          font-weight: 800 !important;
                          margin: 20px 0 5px !important;
                        }
                        h1 {
                          font-size: 22px !important;
                        }
                        h2 {
                          font-size: 18px !important;
                        }
                        h3 {
                          font-size: 16px !important;
                        }
                        .container {
                          padding: 0 !important;
                          width: 100% !important;
                        }
                        .content {
                          padding: 0 !important;
                        }
                        .content-wrap {
                          padding: 10px !important;
                        }
                        .invoice {
                          width: 100% !important;
                        }
                      }
                    </style>
                  </head>

                  <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
                    bgcolor="#f6f6f6">

                    <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
                      <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                        <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
                          valign="top">
                          <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                            <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
                              bgcolor="#fff">
                              <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                <td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                                  <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
                                  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">

                                      </td>
                                    </tr>
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                        Dear user,
                                      </td>
                                    </tr>
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                        Thank you for signing up with us. Please follow this link to verify your Email.
                                      </td>
                                    </tr>
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                        Verify Email address
                                      </td>
                                    </tr>


                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="f
ont-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                        valign="top">
                                        <a href=${verificationURL} class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Confirm email address</a>
                                      </td>
                                    </tr>
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                        Kind Regards,
                                      </td>
                                    </tr>
                                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                      <td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                                        The Sonance Team
                                      </td>
                                    </tr>

                                  </table>
                                </td>
                              </tr>
                            </table>
                            <div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                              <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                  <td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
                                    valign="top">Follow <a href="http://twitter.com/bitwirex" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Binance</a> on Twitter.</td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </td>
                        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
                      </tr>
                    </table>
                  </body>

                  </html>`
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
