const bcryptjs = require('bcryptjs');
var nodemailer = require('nodemailer');
const { registerAdmin } = require('../models/schoolElectionsModel/registerModel');
require('dotenv').config();

const { emailService, emailUser, emailPassword } = process.env;

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // service: emailService,
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

// verify smtp connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to send e-mails");
    }
  });

  const createUserWithPassword = (newUser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (error, hash) => {
            // store the hashed password
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(callback);
        });
    });
};

const createUser = (newUser, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (error, hash) => {
            // store the hashed password
            const newUserResource = newUser;
            newUserResource.password = hash;
            newUserResource.save(callback);
        });
    });
};

const getUserByEmail = (email, callback) => {
    const query = { email };
    registerAdmin.findOne(query, callback);
};

const getUserByUserId = (userId, callback) => {
    const query = { userId };
    registerAdmin.findOne(query, callback);
};

const comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

const generateRandomString = (len = 24) => {
    var crypto = require("crypto");
    var id = crypto.randomBytes(len).toString('hex');
    return id;
}

// Generates a one-time password to be used by the admin
const generateOtp = () => {
    let oneTimePassword = Math.floor(100000 + Math.random() * 900000);
    return oneTimePassword;
}

// Generates a random four digit, similar to gegerateOtp(), just that I use this for a different purpose
// which is to generate digits for the username of the admin
const generateRandomFourDigits = () => {
  let digits = Math.floor(Math.random() * 9000) + 1000;
  return digits;
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return {
    time: hrs + ':' + mins + ':' + secs + '.' + ms,
    hours: hrs,
    miutes: mins,
    seconds: secs,
    milliseconds: ms
  };
}

function msToTimePadded(s) {

  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return {
    time: pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3),
    hours: pad(hrs),
    minutes: pad(mins),
    seconds: pad(secs),
    milliseconds: pad(ms, 3)
  };
  }

// Treats errors encountered calling a callback
const e = (error) => {
  console.log("An error occured:", error);
}

module.exports = {
  createUser,
  getUserByEmail,
  generateRandomFourDigits,
  getUserByUserId,
  comparePassword,
  generateRandomString,
  generateOtp,
  msToTime,
  msToTimePadded,
  transporter,
  e };