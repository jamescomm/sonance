const User = require('../user/user');
const resHndlr = require("../global/Responder");
const RuleBook = require('./ruleBook');
const Market = require('../address/market');
var bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Constants = require('../user/userConstants')


module.exports = {
	'switch':(req,res)=>{
		RuleBook.findOne()
		.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
		.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	},
	'signupSwitch':(req,res)=>{
		if(req.query.signup == true || req.query.signup == false || req.query.signup == "true" || req.query.signup == "false")
		RuleBook.update({},{signup:req.query.signup},{multi:true})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'exchangeSwitch':(req,res)=>{
		if(req.query.exchange == true || req.query.exchange == false || req.query.exchange == "true" || req.query.exchange == "false")
		RuleBook.update({},{exchange:req.query.exchange},{multi:true})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'withdrawSwitchOn':(req,res)=>{
		req.query.currency = req.query.currency.toUpperCase()
		if(req.query.currency)
		RuleBook.update({},{$pull:{withdraw:req.query.currency}},{new:true})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'withdrawSwitchOff':(req,res)=>{
		req.query.currency = req.query.currency.toUpperCase()
		if(req.query.currency)
			RuleBook.findOne()
		.then((result)=>{
			if(result)
			if(result.withdraw.indexOf(req.query.currency)<0)
			RuleBook.update({},{$push:{withdraw:req.query.currency}},{new:true})
			.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
			.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
			else
				return resHndlr.apiResponder(req, res,'You have already performed this action.' , 500)
			else
				return resHndlr.apiResponder(req, res,'We are in the maintinance mode.' , 500)
		})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'tradeSwitchOn':(req,res)=>{
		req.query.currency = req.query.currency.toUpperCase()
		if(req.query.currency)
		RuleBook.update({},{$pull:{trade:req.query.currency}},{new:true})
	.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
	.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'tradeSwitchOff':(req,res)=>{
		req.query.currency = req.query.currency.toUpperCase()
		if(req.query.currency)
			RuleBook.findOne()
		.then((result)=>{
			if(result)
			if(result.trade.indexOf(req.query.currency)<0)
			RuleBook.update({},{$push:{trade:req.query.currency}},{new:true})
			.then((success)=>{return resHndlr.apiResponder(req, res,'Success' , 200,success)})
			.catch((unsuccess)=>{return resHndlr.apiResponder(req, res,'Something went wrong' , 500)})
			else
				return resHndlr.apiResponder(req, res,'You have already performed this action.' , 500)
			else
				return resHndlr.apiResponder(req, res,'We are in the maintinance mode.' , 500)
		})
	else
		return resHndlr.apiResponder(req, res,'Please provide the switch.' , 500)
	},
	'usercount' : function(req, res){
    User.count({}, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For active user Count
'activeusercount' : function(req, res){
    let query = {
        state : {
            status : "active"
        }
    };
    User.count( query, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For deactive user Count
'deactiveusercount' : function(req, res){
    let query = {
        state : {
            status : "deactive"
        }
    };
    User.count( query, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For block user Count
'blockusercount' : function(req, res){
    let query = {
        state : {
            status : "block"
        }
    };
    User.count( query, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For kyc user Count
'kycusercount' : function(req, res){
    User.count( {isKYC:true}, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For pending kyc user Count
'pkycusercount' : function(req, res){
    User.count( {verificationStatus: 1}, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For approved kyc user Count
'akycusercount' : function(req, res){
    User.count( {verificationStatus: 2}, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
//  For rejected kyc user Count
'rkycusercount' : (req, res)=>{
    User.count( {verificationStatus: 2}, function(err, count){
        if(err) return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
        else return resHndlr.apiResponder(req, res,'Success' , 200,count)
    })
},
// state of a user eg: active , deactive or block
'changeUserState' : (req, res)=>{
if(!req.body.status || !req.body._id){
resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
}
else
User.findOneAndUpdate({_id : req.body._id}, {'state.status' : req.body.status.toLowerCase() },{new : true}, function(err, result){
if(err)
return resHndlr.apiResponder(req, res,'Something went wrong' , 400)
else
return resHndlr.apiResponder(req, res,'Success' , 200,result)
})
},
'updateFee':(req,res)=>{
	if(!req.body.feeId || !req.body.transectionCharge)
		resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
	else
	{
		Market.findOneAndUpdate({'currencyData._id':req.body.feeId},{$set:{'currencyData.$.transectionCharge':req.body.transectionCharge}},{new:true})
		.then((success)=>{
			var found = success.currencyData.find(function(element) {
									  return element._id == req.body.feeId;
									});
				      			return resHndlr.apiResponder(req,res,"Address generated successfully",200,found)
		})
		.catch((unsuccess)=>{
			console.log("unsuccess: ",unsuccess)
			return resHndlr.apiResponder(req, res,'Something went wrong' , 400)})
	}
},
'subadmin':(req,res)=>{
	if(!req.body.emailId)
		resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
	else
	{
		User.create({email:req.body.emailId,role:'subadmin'})
		.then((success)=>{
			 var text = '';
            var otppossible = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var i = 0; i < 8; i++) {
                text += otppossible.charAt(Math.floor(Math.random() * otppossible.length));
            };
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ebriks.manish@gmail.com',
                    pass: 'manish123'
                }
            });
            var mailOptions = {
                from: 'ebriks.manish@gmail.com',
                to: req.body.emailId,
                subject: 'Temporary password for binance subadmin.',
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
              <title>Set up a new password for [Product Name]</title>


            </head>
            <body style="-webkit-text-size-adjust: none; box-sizing: border-box; color: #74787E; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; height: 100%; line-height: 1.4; margin: 0; width: 100% !important;" bgcolor="#F2F4F6"><style type="text/css">
          body {
          width: 100% !important; height: 100%; margin: 0; line-height: 1.4; background-color: #F2F4F6; color: #74787E; -webkit-text-size-adjust: none;
          }
          @media only screen and (max-width: 600px) {
            .email-body_inner {
              width: 100% !important;
            }
            .email-footer {
              width: 100% !important;
            }
          }
          @media only screen and (max-width: 500px) {
            .button {
              width: 100% !important;
            }
          }
          </style>
              <span class="preheader" style="box-sizing: border-box; display: none !important; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; mso-hide: all; opacity: 0; overflow: hidden; visibility: hidden;">Use this link to reset your password. The link is only valid for 24 hours.</span>
              <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin: 0; padding: 0; width: 100%;" bgcolor="#F2F4F6">
                <tr>
                  <td align="center" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word;">
                    <table class="email-content" width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin: 0; padding: 0; width: 100%;">


                      <tr>
                        <td class="email-body" width="100%" cellpadding="0" cellspacing="0" style="-premailer-cellpadding: 0; -premailer-cellspacing: 0; border-bottom-color: #EDEFF2; border-bottom-style: solid; border-bottom-width: 1px; border-top-color: #EDEFF2; border-top-style: solid; border-top-width: 1px; box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin: 0; padding: 0; width: 100%; word-break: break-word;" bgcolor="#FFFFFF">
                          <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin: 0 auto; padding: 0; width: 570px;" bgcolor="#FFFFFF">

                            <tr>
                              <td class="content-cell" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; padding: 35px; word-break: break-word;">
                                <h1 style="box-sizing: border-box; color: #2F3133; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 19px; font-weight: bold; margin-top: 0;" align="left">Hi,</h1>
                                <p style="box-sizing: border-box; color: #74787E; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; margin-top: 0;" align="left">You recently requested to forgot your password for your binance account. Use the Temporary password below to reset it. <strong style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;"></strong></p>

                                <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin: 30px auto; padding: 0; text-align: center; width: 100%;">
                                  <tr>
                                    <td align="center" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word;">

                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;">
                                        <tr>
                                          <td align="center" style="box-sizing: border-box; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; word-break: break-word;">
                                             <h5 style="box-sizing: border-box; color: #2F3133; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 15px; font-weight: bold; margin-top: 0;" align="left">${text}</h5>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                                <p style="box-sizing: border-box; color: #74787E; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; line-height: 1.5em; margin-top: 0;" align="left">Thanks,
                                <br />The Binance Team</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) 
                {console.log(error)
                         return resHndlr.apiResponder(req, res, 'Something went wrong.', 400,error)
                     }
                 else {
                    bcrypt.hash(text, 9, function(err, hash) {
                        if (err)
                        	{console.log("err: ",err)
                         return resHndlr.apiResponder(req, res, 'Something went wrong.', 400,err)
                        }
                        else User.update({email: req.body.emailId}, {password: hash}, {new: true}, function(err, record) {
                            if (err)
                            { console.log("err2: ",err)
                         return resHndlr.apiResponder(req, res, 'Something went wrong.', 400,err)
                     }
                         return resHndlr.apiResponder(req, res, 'Your temporary password is send on your email.', 200)
                        });
                    });
                }
            });
		})
	.catch((unsuccess)=>{
		console.log("unsuccess: ",unsuccess)
		return resHndlr.apiResponder(req, res,'Something went wrong' , 400,unsuccess.errmsg)})
	}

}

}