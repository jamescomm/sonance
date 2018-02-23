// Initilize redis connection
 var RuleBook = require("../admin/ruleBook");
var express = require('express'),
app = express()
// Load user routes
const userRoutes = require('../user/userRoutes');
// Load address routes
const addressRoutes = require('../address/addressRoutes');
// Load response module
const responseHandler = require('../global/Responder');
// Load transection module
const transectionRoute = require('../transection/transectionRoute');
// Load exchange module
const exchangeRoutes = require('../exchange/exchangeRoutes');
// Load exchange module
const adminRoutes = require('../admin/adminRoutes');
//========================== Load Modules End ==============================================

//========================== Export Module Start ====== ========================

module.exports = function (app) {
app.use('/*', function(req, res, next) {
  if(req.baseUrl.indexOf('/exchanges/api/v1/admin/')>=0 || req.baseUrl.indexOf('/exchanges/api/v1/address/marketData')>=0)
 next();
else
 RuleBook.findOne()
 .then((success)=>{
  if (success) {
    if(success.exchange == false)
    {
        responseHandler.apiResponder(req,res,'Site is in under maintinance.',402);
    }
  else{
    next();
  }
 }
})
})
    // Attach User Routes
    app.use('/exchanges/api/v1/user', userRoutes);
    // Attach Address Routes
    app.use('/exchanges/api/v1/address', addressRoutes);
    // Attach ErrorHandler to Handle All Errors
    app.use(responseHandler.apiResponder);
    //	Attach Transection route
     app.use('/exchanges/api/v1/transection', transectionRoute);
     //	Attach Exchange route
     app.use('/exchanges/api/v1/exchange', exchangeRoutes);
      // Attach admin route
     app.use('/exchanges/api/v1/admin', adminRoutes);
};
