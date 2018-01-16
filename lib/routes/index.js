// Initilize redis connection
// var redisClient = require("../redisClient/init");

// Load user routes
const userRoutes = require('../user/userRoutes');

// Load response module
const responseHandler = require('../global/Responder');

//========================== Load Modules End ==============================================

//========================== Export Module Start ====== ========================

module.exports = function (app) {

    // Attach User Routes
    app.use('/exchanges/api/v1/user', userRoutes);
    // Attach ErrorHandler to Handle All Errors
    app.use(responseHandler.apiResponder);
};
