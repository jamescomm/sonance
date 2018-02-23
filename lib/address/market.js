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


let marketData = mongoose.model('market',market);
module.exports = mongoose.model('market',market);
// marketData.findOneAndUpdate({},{$push:{currencyData:{
//     'country': '',
//     'name': 'Etherium',
//     'currency': 'ETH',
//     'COMPANYACCOUNT': '0xA28Ed8e31a0223ff225AD6bf7d56B1Ba45497F89',
//     'transectionCharge':0.001
// }
// }
// },{new:true})
// .then((sucess)=>console.log(sucess))
// .catch((unsuccess)=>console.log(unsuccess))

var invoke = function()
{
	marketData.count(function(err,data)
	{
		
		if(err)
		{
			console.log("Please try again later.");
		}
		else if(data!=0)
		{
			console.log("Super marketData start...");
		}
		else
		{
		marketData = new marketData({});
			marketData.save(function(err,data)
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