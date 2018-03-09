const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let credentials = new Schema({
BTC:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:18332},
	user:{type:String,default:'test'},
	pass:{type:String,default:'test123'}
}],
LTC:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:9332},
	user:{type:String,default:'litecoinrpc'},
	pass:{type:String,default:'passwoasd'}
}],
BCH:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:18336},
	user:{type:String,default:'testxbc'},
	pass:{type:String,default:'test123xbc'}
}],
Dogecoin:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:9334},
	user:{type:String,default:'test'},
	pass:{type:String,default:'test123'}
}],
BFX:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:7500},
	user:{type:String,default:'BFXCoinrpc'},
	pass:{type:String,default:'78pW9EbUvNKVYX'}
}],
PowerCoin:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:7502},
	user:{type:String,default:'PowerZrpc'},
	pass:{type:String,default:'8ceR2LydLG6AoEw'}
}],
CoinZCoin:[{
	host:{type:String,default:'192.64.116.199'},
	port:{type:Number,default:7501},
	user:{type:String,default:'CoinZrpc'},
	pass:{type:String,default:'8ceR2LydLG6AoEw'}
}]
},{strict:false});

module.exports = mongoose.model('credentials',credentials);
var credential = mongoose.model('credentials',credentials);
var invoke = function()
{
	credential.count(function(err,data)
	{
		
		if(err)
		{
			console.log("Please try again later.");
		}
		else if(data!=0)
		{
			console.log("rpcs setup...");
		}
		else
		{
		// credential = new credential({});
			credential.create({
BTC:[{
	host:'192.64.116.199',
	port:18332,
	user:'test',
	pass:'test123'
}],
LTC:[{
	host:'192.64.116.199',
	port:9332,
	user:'litecoinrpc',
	pass:'passwoasd'
}],
BCH:[{
	host:'192.64.116.199',
	port:18336,
	user:'testxbc',
	pass:'test123xbc'
}],
Dogecoin:[{
	host:'192.64.116.199',
	port:9334,
	user:'test',
	pass:'test123'
}],
CoinZCoin:[{
	host:'192.64.116.199',
	port:7501,
	user:'CoinZrpc',
	pass:'8ceR2LydLG6AoEw'
}],
BFX:[{
	host:'192.64.116.199',
	port:7500,
	user:'BFXCoinrpc',8ceR2LydLG6AoEw
	pass:'78pW9EbUvNKVYX'
}],
PowerCoin:[{
	host:'192.64.116.199',
	port:7502,
	user:'PowerZrpc',
	pass:'8ceR2LydLG6AoEw'
}]
			},function(err,data)
			{
				if(err)
				{
					console.log(err);
					console.log("Error in saving RPC.");
				}
				else
				{
					console.log("RPCs setting up...");
				}
			})
		}
	})
}
invoke();