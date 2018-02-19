let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ticket = new Schema({
  attributes: {
    ticketOwnerId: {
      type:String,ref:'users'
    },
    department: {
      type: 'string'
    }, //IT,TESTING etc
    title: {
      type: 'string'
    }, //short summary
    description: {
      type: 'string'
    },
    attachment: {
      type: 'string'
    }, //image of prob. etc
    status: {
      type: Number
    }, //0=pending , 1=inProgress, 2=resolved
    // resolvedBy: {ref: 'user'},
    createTimeUTC: {
      type: 'string'
    },
    resolvedTimeUTC: {
      type: 'string'
    }
  }
});
module.exports = mongoose.model('ticket',ticket);
