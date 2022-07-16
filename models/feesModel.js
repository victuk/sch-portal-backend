const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feesSchema = new Schema({
    studentID: {
        type: Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    amount: Number,
    referenceID: String,
    term: {
        enum: ['first-term', 'second-term', 'third-term'],
        required: true
    },
    year: String
},
{ timestamps: true });

const schoolFees = mongoose.model('schoolFees', feesSchema);

module.exports = { schoolFees };