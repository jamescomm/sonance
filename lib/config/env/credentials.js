const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let credentials = new Schema({
btc:[{
	host:{type:String},
	port:{type:String},
	user:{type:String},
	pass:{type:String}
}],
ltc:[{
	host:{type:String},
	port:{type:String},
	user:{type:String},
	pass:{type:String}
}],
bch:[{
	host:{type:String},
	port:{type:String},
	user:{type:String},
	pass:{type:String}
}],
dash:[{
	host:{type:String},
	port:{type:String},
	user:{type:String},
	pass:{type:String}
}],
bfx:[{
	host:{type:String},
	port:{type:String},
	user:{type:String},
	pass:{type:String}
}],
steller:[{
	host:{type:String},
	port:{type:String},
	user:{type:String},
	pass:{type:String}
}],
},{strict:false});

module.exports = mongoose.model('credentials',credentials);