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
	actionBY:{type:mongoose.Schema.Types.ObjectId}
},
referCode:{type:String}, // should be unique
referTime:{type:String},// time till that refer code is valid
referBy:{type:mongoose.Schema.Types.ObjectId},//id of that user who refered you for this side
referStatus:{type:Boolean}, //refer is valid or not
email:{type:String}, //
password:{type:String}, //
spendingPassword:{type:String}, //for exchanges or payment related actions
createdAt:{type:String}, //
ip:{type:String},
token:{
	status:{type:String},
	token_id:{type:String}
}
});

module.exports = mongoose.model('user',user);
