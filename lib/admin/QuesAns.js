let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let QuesAns = new Schema({
	Ques:{type:String},
	Ans:{type:String}
},{strict:false})
module.exports = mongoose.model('QuesAns',QuesAns);