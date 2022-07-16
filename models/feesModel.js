const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const electionSchema = new Schema({
    adminID: {
        type: Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    electionTitle: String,
    electionLogo: String,
    electionLogoPublicId: String,
    electoralSystem: String,
    electionType: {
        type: String,
        enum: ['general', 'faculty', 'department', 'hostel', 'staff', 'class', 'association', 'award-choice', 'school-contest', 'post-graduate']
    },
    durationStart: Date,
    durationEnd: Date,
    candidatesList: Object,
    votersList: Object,
    displayData: Object,
    paid: Boolean,
    grandTotalPayment: Number,
    electionUrl: String,
    createDate: Date,
    modifyDate: Date
});

const election = mongoose.model('elections', electionSchema);

module.exports = { election };