// Initilize redis connection
// var redisClient = require("../redisClient/init");

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

//========================== Load Modules End ==============================================

//========================== Export Module Start ====== ========================

module.exports = function (app) {

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
};
