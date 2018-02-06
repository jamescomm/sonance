const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let transactions = new Schema({
userId:{type: mongoose.Schema.Types.ObjectId,ref: 'User'}, // whose transaction is this
transaction_id:{type:String},
amount:{type:String,default:true},
status:{type:String,default:true}, //block/deactive
withdraw:{type:Boolean},
time:{type:Date,default:Date.now},
},{strict:false});

module.exports = mongoose.model('transactions',transactions);