const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feesSelectorSchema = new Schema({
    editedBy: {
        type: Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    amount: Number,
    studentClass: {
        type: String,
        enum: ['js1', 'js2', 'js3', 'ss1', 'ss2', 'ss3']
    }
},
{ timestamps: true });

const schoolFeesSelector = mongoose.model('schoolFeesSelector', feesSelectorSchema);

module.exports = { schoolFeesSelector };