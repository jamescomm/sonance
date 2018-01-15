const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let order = new Schema({
status:{type:Boolean}, //
amount:{
	value:{type:Number}, // amount in integer
	currency:{type:String} // in which currency
},
rate:{type:Number},
volume:{ // what he received on this rate
	value:{type:Number}, // amount in integer
	currency:{type:String}, // in which currency
},
type:{type:String},  // only bid/ask
userId:{type:mongoose.Schema.Types.ObjectId}, //who is involved in this transection
createdAt:{type:String},
processedAt:{type:String},
market:{type:String}, // like inr/btc , usd/btc (optional coloum)
total_amount:{type:Number}, //optional
freezed_amount:{type:Number}, //optional
total_volume:{type:Number},
freezed_volume:{type:Number}
},{strict:false});

module.exports = mongoose.model('order',order);

