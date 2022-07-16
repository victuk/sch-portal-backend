const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feesSchema = new Schema({
    electionUrl: String
},
{ timestamps: true });

const schoolFees = mongoose.model('schoolFees', feesSchema);

module.exports = { schoolFees };