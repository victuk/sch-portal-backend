const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    surName: String,
    otherNames: String,
    gender: String,
    passportPicture: String,
    passportPublicId: String,
    dateOfBirth: Date,
    parentRole: String,
    subjectsClass: Object,
    phoneNumber: String,
    stateOfOrigin: String,
    localGovernmentOfOrigin: String,
    email: String,
    password: String,
    role: String,
    emailVerified: Boolean,
    suspended: Boolean
},
{ timestamps: true });

const usersDB = mongoose.model('users', userSchema);

module.exports = { usersDB };
