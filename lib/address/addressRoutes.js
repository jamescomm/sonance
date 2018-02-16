const adrsRoute = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const addressServices = require("../address/addressServices")



adrsRoute.route("/genAddress")
    .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        addressServices.genAddress(req,res)
    });
adrsRoute.route("/marketData")
    .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        addressServices.marketData(req,res)
    });



module.exports = adrsRoute;
