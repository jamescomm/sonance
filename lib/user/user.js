const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let user = new Schema({
name:{type:String,default:''},
middleName:{type:String,default:''},
lastName:{type:String,default:''},
phone:{type:String,default:''},
otp:{type:String,default:''},
verifyPhone:{type:Boolean,default:false},// true/false
isTwoFactor:{type:Boolean,default:false},
isKYC:{type:Boolean,default:false},
verificationStatus:{type:Number},
kycForm:{type:String,ref:'kyc'},
state:{ //for delete/block/deactive
	status:{type:String,default:"deactive"},
	actionBY:{type:String , ref : 'user'}
},
referCode:{type:String}, // should be unique
referTime:{type:String},// time till that refer code is valid
referBy:{type:Schema.Types.ObjectId, ref : 'user'},//id of that user who refered you for this side
referStatus:{type:Boolean}, //refer is valid or not
email:{type:String,unique:true,lowercase:true}, //
password:{type:String}, //
// spendingPassword:{type:String}, //for exchanges or payment related actions
createdAt:{type:Date, default:Date.now}, //
ip:{type:String},
token:{
	status:{type:String},
	token_id:{type:String}
},
role:{type:String,default:"user"},
balance:{type:String, ref : 'currencies'},
loginDetails:[{
	time:{type:Date,default:Date.now},
	ip:{type:String},
	location:{type:String}
}]
});

module.exports = mongoose.model('User',user);

