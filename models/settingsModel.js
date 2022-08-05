const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    currentTerm: String,
    currentYear: String
},
{ timestamps: true });

const settings = mongoose.model('settings', settingsSchema);

module.exports = { settings };