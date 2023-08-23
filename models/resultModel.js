const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
    studentID: {
        type: Schema.Types.ObjectId, ref: 'users',
        required: true
    },
    teacherID: {
        type: Schema.Types.ObjectId, ref: 'users',
        required: true
    },
    studentClass: {
        type: String,
        enum: ['js1', 'js2', 'js3', 'ss1', 'ss2', 'ss3']
    },
    term: {
        type: String,
        enum: ['first-term', 'second-term', 'third-term']
    },
    subject: String,
    testOne: {
        type: Number,
        default: 0
    },
    testTwo: {
        type: Number,
        default: 0
    },
    testThree: {
        type: Number,
        default: 0
    },
    examScore: {
        type: Number,
        default: 0
    },
    testsAndExamTotal: {
        type: Number,
        default: 0
    },
    year: String
},
{ timestamps: true });

const result = mongoose.model('results', resultSchema);

module.exports = { result };