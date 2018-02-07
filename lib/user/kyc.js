const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var kyc = new Schema(
{
    firstName: {type: String},
    middleName: {type: String},
    lastName: {type: String},
    addLine1: {type: String},
    addLine2: {type: String},
    DOB : {type: String},
    verificationDate : {type : Date},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    pincode: {type: String},
    mobileNumber: {type: String},
    bankAccountHolderName: {type: String},
    bankAccountNumber: {type: String},
    bankName: {
      type: String
    },
    IFSCCode: {
      type: String
    },
    taxProofNumber: {
      type: String
    },
    taxProofImage: {
      type: String
    },
    addressProofType: {
      type: String
    },
    addressProofNumber: {
      type: String
    },
    addressProofImage: {
      type: String
    },
    isAgree: {
      type: Boolean,
      default: false
    },
    refNumber: {
      type: String
    },
    refAmount: {
      type: Number,
      default: 0
    },
    modeOfPayment: {
      type: String
    },
    verificationowner: {
      type: String, ref:'User', 
    }
  });

  module.exports = mongoose.model('kyc',kyc);
  