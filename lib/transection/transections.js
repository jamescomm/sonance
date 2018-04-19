const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let transactions = new Schema({
userId:{type: mongoose.Schema.Types.ObjectId,ref: 'User'}, // whose transaction is this
amount:{type:String,default:true},
currency:{type:String},
status:{type:String,default:false},
time:{type:Date,default:new Date().getTime()},
identity:{type:String},
},{strict:false});

module.exports = mongoose.model('transactions',transactions);