const MESSAGES = {
    RequiredField : "Please fill all the required fields.",
    NoDataFound : "No data found for this user"
  }
  module.exports = {
    MESSAGES:MESSAGES
};
const Market = require('./market');

// Market.findOneAndUpdate({},{$push:{currencyData:
// 	{
// 	'country': 'Australia',
//     'name': 'Dollar',
//     'currency': 'AUD',
//     'COMPANYACCOUNT': 'EXbitwireAUD@gmail.com',
//     'transectionCharge':0.1
// }
// }},{new:true})
// .then((success)=>console.log(success))
// .catch((unsuccess)=>console.log(unsuccess))
