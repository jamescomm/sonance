"use strict";

//========================== Load Modules Start ===========================
var Promise = require("bluebird");
//========================== Load internal Module =========================
var exceptions = require("../customeException.js");
var jwtHandler = require("../jwtHandler");
var constants = require("../constants");
const resHndlr = require("../global/Responder");

//========================== Load Modules End =============================

var __verifyTok = function (acsTokn) {
    console.log("in __verifyTok: ",acsTokn)
    return jwtHandler.verifyUsrToken(acsTokn)
        .then(function (tokenPayload) {
            console.log("ya yhaaaaaa")
            return tokenPayload;
        })
        .catch(function (err) {
            console.log("in __verifyTok")
            throw err
        })
};

var expireToken = function(req, res, next) {
    
    return jwtHandler.expireToken(req)
    .then(function(result) {
        return result;
        next();
    })
    .catch(function (err) {
            next(err)
        })
}


var autntctTkn = function (req, res, next) {
    var acsToken = req.headers;
    console.log("acsToken: ",acsToken.authorization,acsToken.authorization == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZm9vYmFyIiwiaWF0IjoxNTE4MDc2MzI3LCJleHAiOjE1MTgwNzk5Mjd9.pTcJJRnw7XZCB1aeF-d0HZhKJ0nCAqICTTJ8mZQXOeM"
        )
    // __verifyTok(acsToken)
    //     .bind({})
    //     .then(function (tokenPayload) {
    //         console.log("jiiii yha")

    //         return tokenPayload;
    //     })
    //     .then(function (result) {
    //         console.log("this.payload: ",this.payload)
    //         req.user = this.payload;
    //         next()
    //     })
    //     .catch(function (err) {
    //         console.log("final catch",JSON.stringify(err))
    //         next(err);
    //     })
}




//========================== Export Module Start ===========================

module.exports = {
    autntctTkn,
    expireToken
};

//========================== Export Module End ===========================
