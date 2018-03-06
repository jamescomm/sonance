const Ticket = require('./ticket')
const moment = require('moment')
const nodemailer = require('nodemailer');
const resHndlr = require("../global/Responder");
const User = require("../user/user");
//apis
module.exports = {
  generateTicket: (req, res) => {
    if (!req.body.ticketOwnerId || !req.body.title || !req.body.description)
      return res.json({
        "message": 'Please fill the required details.',
        statusCode: 500
      })
    req.body.createTimeUTC = Date.parse(moment.utc().format()) / 1000;
    req.body.status = 0;
    User.findOne({_id:req.body.ticketOwnerId})
    .then((success)=>{
      if(success)
    Ticket.create(req.body)
      .then((success) => {
        if (success)
        {
               var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'jamescommunication316@gmail.com',
                    pass: 'user@#0131'
                }
            });
            var mailOptions = {
                from: 'jamescommunication316@gmail.com',
                to: 'jamescommunication316@gmail.com',
                subject: req.body.title + "id:"+success._id,
                text:req.body.ticketOwnerId + " generate ticket " + req.body.description
            };
            transporter.sendMail(mailOptions)
            .then((successed)=>{
              console.log("successed: ",successed)
              return resHndlr.apiResponder(req, res, 'Your query will be shortly solved.', 200,"your ticket id: "+success._id)})
            .catch((unsuccess)=>{return resHndlr.apiResponder(req, res, 'Something went wrong.', 400,error)})
        }
        else
          return res.json({
            "message": 'Something went wrong in generating ticket.',
            statusCode: 500
          })
      })
      else
        return res.json({
            "message": 'Unauthorized access.',
            statusCode: 403
          })
      })
      .catch((unsuccess) => {
        console.log("unsuccess in generate ticket:   ", unsuccess);
        return res.json({
          "message": 'Something went wrong in generating ticket.',
          statusCode: 500
        })
      })
  },
  'getTicketsByTicketOwnerId': (req, res) => {
    if (!req.body.ticketOwnerId)
      return res.json({
        "message": 'Please fill the required details.',
        statusCode: 500
      })
    else
      Ticket.find({
        ticketOwnerId: req.body.ticketOwnerId
      })
      .then((success) => {
        if (success)
          return res.json({
            "message": 'Your all generated tickets.',
            statusCode: 200,
            data: success
          })
        else
          return res.json({
            "message": 'Nothing related to your request.',
            statusCode: 500
          })
      })
      .catch((unsuccess) => {
        console.log("unsuccess in getting ticket by ticketOwnerId:   ", unsuccess);
        return res.json({
          "message": 'Something went wrong in getting ticket by ticketOwnerId.',
          statusCode: 500
        })
      })
  },
  'getAllTickets': (req, res) => {
    Ticket.find({}).populateAll()
      .then((success) => {
        if (success)
          return res.json({
            "message": 'Your all generated tickets.',
            statusCode: 200,
            data: success
          })
        else
          return res.json({
            "message": 'Nothing related to your request.',
            statusCode: 500
          })
      })
      .catch((unsuccess) => {
        console.log("unsuccess in getting all tickets:   ", unsuccess);
        return res.json({
          "message": 'Something went wrong in getting all tickets.',
          statusCode: 500
        })
      })
  },
  'getTicketByTicketId': (req, res) => {
    if (!req.body.ticketId)
      return res.json({
        'message': 'Please provide the ticket id',
        statusCode: 500
      })
    else
      Ticket.findOne({
        id: req.body.ticketId
      })
      .then((success) => {
        if (success)
          return res.json({
            "message": 'Ticket that you request for.',
            statusCode: 200,
            data: success
          })
        else
          return res.json({
            "message": 'Nothing related to your request.',
            statusCode: 500
          })
      })
      .catch((unsuccess) => {
        console.log("unsuccess in getting tickets by id:   ", unsuccess);
        return res.json({
          "message": 'Something went wrong in getting ticket.',
          statusCode: 500
        })
      })
  },
  'resolveTicketIssue': (req, res) => {
    if (!req.body.ticketId || !req.body.resolvedBy || !req.body.status)
      return res.json({
        'message': 'Please provide the ticket id',
        statusCode: 500
      })
    Ticket.update({
        id: req.body.ticketId
      }, {
        resolvedTimeUTC: Date.parse(moment.utc().format()) / 1000,
        resolvedBy: req.body.resolvedBy,
        status: req.body.status
      })
      .then((success) => {
        if (success)
          return res.json({
            "message": 'Ticket status updated successfully.',
            statusCode: 200,
            data: success
          })
        else
          return res.json({
            "message": 'Nothing related to your request.',
            statusCode: 500
          })
      })
      .catch((unsuccess) => {
        console.log("unsuccess in update ticket status:   ", unsuccess);
        return res.json({
          "message": 'Something went wrong in updating ticket status.',
          statusCode: 500
        })
      })
  }
};