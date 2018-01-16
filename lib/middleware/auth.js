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
            return tokenPayload;
        })
        .catch(function (err) {
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
    var acsToken = req.get('accessToken');
    console.log("acsToken: ",acsToken)
    __verifyTok(acsToken)
        .bind({})
        .then(function (tokenPayload) {
            return tokenPayload;
        })
        .then(function (result) {
            req.user = this.payload;
            next()
        })
        .catch(function (err) {
            console.log("final catch",JSON.stringify(err))
            next(err);
        })
}




//========================== Export Module Start ===========================

module.exports = {
    autntctTkn,
    expireToken
};

//========================== Export Module End ===========================
