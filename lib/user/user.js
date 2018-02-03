const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let user = new Schema({
name:{type:String},
middleName:{type:String},
lastName:{type:String},
phone:{type:String},
otp:{type:String},
verifyPhone:{type:Boolean},// true/flase
state:{ //for delete/block/deactive
	status:{type:String},
	actionBY:{type:String , ref : 'user'}
},
referCode:{type:String}, // should be unique
referTime:{type:String},// time till that refer code is valid
referBy:{type:Schema.Types.ObjectId, ref : 'user'},//id of that user who refered you for this side
referStatus:{type:Boolean}, //refer is valid or not
email:{type:String,unique:true,lowercase:true}, //
password:{type:String}, //
spendingPassword:{type:String}, //for exchanges or payment related actions
createdAt:{type:Date, default:Date.now}, //
ip:{type:String},
token:{
	status:{type:String},
	token_id:{type:String}
},
role:{type:String,default:"user"},
balance:{type:String, ref : 'currencies'}
});

module.exports = mongoose.model('User',user);
