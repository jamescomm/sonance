const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
let order = new Schema({
status:{type:Boolean,default:false}, //	pending/success
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
userId:{type:String}, //who is involved in this transection
createdAt:{type:Number},
processedAt:{type:Number},
market:{type:String}, // like inr/btc , usd/btc (optional coloum)
total_amount:{type:Number}, //optional
total_volume:{type:Number},
isEngage:{type:Boolean,default:false},
isCancel:{type:Boolean,default:false},
},{strict:false});

order.plugin(mongoosePaginate);
module.exports = mongoose.model('order',order);

