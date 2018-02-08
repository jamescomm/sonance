// load all dependencies
var Promise = require("bluebird");
var jwt = Promise.promisifyAll(require("jsonwebtoken"));
var exceptions = require('./customeException')
var appConstants = require('./constants');
var redisClient = require("./redisClient/init");
// var TOKEN_EXPIRATION_SEC = appConstants.TOKEN_EXPIRATION_TIME * 60;

// var EMAIL_LINK_EXP_TIME = '2d'
// // var JWT_ALGORITHM = 'RS256';
// var JWT_SECRET_KEY = "login_secret_key_to_save_data";

// var genUsrToken = function (user, setExpire) {
//     var options = {};
//     return jwt.signAsync(user, JWT_SECRET_KEY, options)
//         .then(function (jwtToken) {
//             return jwtToken;
//         })
//         .catch(function (err) {
//             throw new exceptions.tokenGenException()
//         })
// }

// var genAdminToken = function (admin, setExpire) {
//     var options = {};
//     return jwt.signAsync(admin, JWT_SECRET_KEY, options)
//         .then(function (jwtToken) {
//             return jwtToken;
//         })
//         .catch(function (err) {
//             throw new exceptions.tokenGenException()
//         })
// }

var verifyUsrToken = function (acsTokn) {
    console.log("in verifyUsrToken : ",acsTokn == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZm9vYmFyIiwiaWF0IjoxNTE4MDc2MzI3LCJleHAiOjE1MTgwNzk5Mjd9.pTcJJRnw7XZCB1aeF-d0HZhKJ0nCAqICTTJ8mZQXOeM" )
jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZm9vYmFyIiwiaWF0IjoxNTE4MDc2MzI3LCJleHAiOjE1MTgwNzk5Mjd9.pTcJJRnw7XZCB1aeF-d0HZhKJ0nCAqICTTJ8mZQXOeM",
    'secret',(err,result)=>
{
    if(err)
        console.log("errrrrrr",err);
    else
        console.log("result",result);
})
        // .then(function (tokenPayload) {
        //     console.log(":::::::::::")
        //     this.tokenPayload = tokenPayload;
        //     return this.tokenPayload
        // })
        // // .then(function(reply) {
        // //     console.log( "vevrev",reply);
        // //     // if(reply) {
        // //     //     throw new exceptions.getInvalidJwtTokenException();
        // //     // } else {
        // //     //     return this.tokenPayload;
        // //     // }
        // //     if(reply)
        // //     { console.log("reply:::")
        // //         return this.tokenPayload;
        // //     }
        // //     else 
        // //         {console.log("in then")
        // //         throw err;
        // //     }
        // // })
        // .catch(function (err) {
        //     // console.log("in err: ::::::::::::::::: ",err)
        //     // throw new exceptions.unauthorizeAccess(err);
        // })
}

// var verifyUsrForgotPassToken = function (acsTokn) {
//     return jwt.verifyAsync(acsTokn, JWT_SECRET_KEY)
//         .then(function (tokenPayload) {
//             return tokenPayload;
//         })
//         .catch(function (err) {
//             throw new exceptions.unauthorizeAccess(err);
//         })
// }

// var expireToken = function (req) {
//     var token = req.get('accessToken');
//     console.log(token);
//     if (token) {
//         //blacklist token in redis db
//         //it will be removed after 6 months
//         redisClient.setValue(token, true);
//         redisClient.expire(token, TOKEN_EXPIRATION_SEC);
//     }
//     console.log("fine");
// }
module.exports = {
    // genUsrToken: genUsrToken,
    verifyUsrToken: verifyUsrToken,
    // expireToken : expireToken,
    // genAdminToken: genAdminToken,
    // verifyUsrForgotPassToken
}
