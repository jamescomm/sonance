let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ruleBook = new Schema({
	accessTo:[String],//roles admin, subadmin etc
	signup:{type:Boolean,default:true},//true = signup allow, false = signup not allow
	withdraw:[String],
	exchange:{type:Boolean,default:true},
	trade:[String],
},{strict:false})
module.exports = mongoose.model('ruleBook',ruleBook);
admin= mongoose.model('ruleBook',ruleBook);
// admin.create({$push:{accessTo:'admin'}})
// .then((success)=>console.log('admin:::',success))
// .catch((unsuccess)=>console.log("unsuccess: ",unsuccess))
var invoke = function()
{
	admin.count(function(err,data)
	{
		
		if(err)
		{
			console.log("Please try again later.");
		}
		else if(data!=0)
		{
			console.log("Super admin ruleBook start...");
		}
		else
		{
		admin = new admin({$push:{accessTo:'admin'}});
			admin.save(function(err,data)
			{
				if(err)
				{
					console.log(err);
					console.log("Error in saving Admin.");
				}
				else
				{
					console.log("SuperAdmin ruleBook created successfully.");
				}
			})
		}
	})
}
invoke();
module.exports = mongoose.model('ruleBook',ruleBook);