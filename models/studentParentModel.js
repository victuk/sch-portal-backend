const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentParentSchema = new Schema({
    parentID: {
        type: Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    childID: {
        type: Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    requestStatus: String
},
{ timestamps: true });

const studentParentDB = mongoose.model('studentsParent', studentParentSchema);

module.exports = { studentParentDB };