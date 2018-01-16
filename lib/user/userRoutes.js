const usrRoutr = require("express").Router();
const resHndlr = require("../global/Responder");
const middleware = require("../middleware");
const userServices = require("./userServices");
const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
// const appUtil = require("../appUtils");
//const mediaUpload = require("../mediaupload/mediaUploadmiddleware");
// const validators=require("./userValidators");


usrRoutr.route("/createUser")
    .post([middleware.authenticate.autntctTkn], function (req, res) {
          // let { user } = req;
          console.log("hi")
        userServices.createUser(req)
            .then(function (result) {
                console.log("result :: ", JSON.stringify(result))
                resHndlr.apiResponder(req,res,'messages',200)
            }).catch(function (err) {
                console.log("err :: ", err)
                resHndlr.apiResponder(req,res,'messages',500)
            })

    });




module.exports = usrRoutr;
