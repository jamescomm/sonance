let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let apiContent = new Schema({
	title:{type:String},
	body:{type:String}
},{strict:false})
module.exports = mongoose.model('apiContent',apiContent);