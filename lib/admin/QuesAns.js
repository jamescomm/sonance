let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let QuesAns = new Schema({
	Ques:{type:String},
	Ans:{type:String}
},{strict:false})
module.exports = mongoose.model('QuesAns',QuesAns);
admin= mongoose.model('QuesAns',QuesAns);
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
			console.log("Super admin QuesAns start...");
		}
		else
		{
		admin = new admin({});
			admin.save(function(err,data)
			{
				if(err)
				{
					console.log(err);
					console.log("Error in saving QuesAns Admin.");
				}
				else
				{
					console.log("SuperAdmin QuesAns created successfully.");
				}
			})
		}
	})
}
invoke();
module.exports = mongoose.model('QuesAns',QuesAns);