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
			console.log("Admin accounts start...");
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
			var dataToInsert = [{
					    'country': '',
					    'name': 'Etherium',
					    'currency': 'ETH',
					    'COMPANYACCOUNT': '',
					    'transectionCharge':0.001
						},
						{
					    'country': '',
					    'name': 'Bitcoin',
					    'currency': 'BTC',
					    'COMPANYACCOUNT': '',
					    'transectionCharge':0.001
						},
						{
					    'country': '',
					    'name': 'Bitcoin cash',
					    'currency': 'BCH',
					    'COMPANYACCOUNT': '',
					    'transectionCharge':0.001
						},
						{
					    'country': '',
					    'name': 'Lite coin',
					    'currency': 'LTC',
					    'COMPANYACCOUNT': '',
					    'transectionCharge':0.001
						},
						{
					    'country': '',
					    'name': '',
					    'currency': '',
					    'COMPANYACCOUNT': '',
					    'transectionCharge':0.001
						},
						{
					    'country': '',
					    'name': '',
					    'currency': '',
					    'COMPANYACCOUNT': '',
					    'transectionCharge':0.001
						}]
						counter = 0;
					Async.forEachLimit(dataToInsert,1,(object,next)=>{
						counter ++;
						marketData.findOneAndUpdate({},{$push:{currencyData:object}},{new:true})
					.then((sucess)=>{console.log("please wait seting up server...");
						if(counter<dataToInsert.length)
							next();
						else
							console("Server setup successfully...Enjoy the service")
					})
					.catch((unsuccess)=>console.log(unsuccess))
					})
					
				}
			})
		}
	})
}
invoke();