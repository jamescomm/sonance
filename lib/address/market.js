const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const Schema = mongoose.Schema;
let market = new Schema({
currencyData:[{
status:{type:String,default:true}, //block/deactive
country:{type:String}, //india/japan etc
COMPANYACCOUNT:{type:String,sparse: true},
name:{type:String,sparse:true}, //currency name (rupees/US_dollor/repple/etc...)
currency:{type:String,sparse:true}, // inr/usd/eur/etc...
transectionCharge:{type:Number,default:0.1}
}]
},{strict:false});



module.exports = mongoose.model('market',market);