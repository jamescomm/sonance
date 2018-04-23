const adrsRoute = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const addressServices = require("../address/addressServices")



adrsRoute.route("/genAddress")
    .post([middleware.authenticate.autntctTkn], function (req, res) {
         // if(req.user._id == req.body.user_id)
        addressServices.genAddress(req,res)
        // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
adrsRoute.route("/marketData")
    .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        addressServices.marketData(req,res)
    });
adrsRoute.route("/getPrivateKeyBTC")
    .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        addressServices.getPrivateKey(req,res)
    });


module.exports = adrsRoute;
