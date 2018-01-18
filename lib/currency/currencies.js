const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let currencies = new Schema({
userId:{type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}, // whose currency is this
currencies:[{
status:{type:String,default:true}, //block/deactive
country:{type:String}, //india/japan etc
address:{type:String,sparse: true},
balance:{type:Number,default:0}, //$inc will help us out to increase and decrease this value
freezeBalance:{type:Number,default:0},
name:{type:String,sparse:true}, //currency name (rupees/US_dollor/repple/etc...)
currency:{type:String,sparse:true} // inr/usd/eur/etc...
}]
},{strict:false});



module.exports = mongoose.model('currencies',currencies);