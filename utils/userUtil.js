const bcryptjs = require('bcryptjs');
var nodemailer = require('nodemailer');
const { usersDB } = require('../models/usersModel');
const { result } = require('../models/resultModel');
const { studentPositionAndRemark } = require('../models/positionAndRemarksModel');
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
    usersDB.findOne(query, callback);
};

const getUserByUserId = (userId, callback) => {
    const query = { userId };
    usersDB.findOne(query, callback);
};

const comparePassword = (candidatePassword, hash, callback) => {
    bcryptjs.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

const generateRandomHex = (len = 24) => {
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

function resultRemark(tScore) {
  const totalScore = parseInt(tScore);
  if(totalScore >= 80 && totalScore <= 100) {
    return {grade: 'A+', remark: 'Brilliant'}
  } else if ((totalScore >= 70 && totalScore <= 79)) {
    return {grade: 'A', remark: 'Excellent'}
  } else if ((totalScore >= 60 && totalScore <= 69)) {
    return {grade: 'B', remark: 'Very Good'}
  } else if ((totalScore >= 50 && totalScore <= 59)) {
    return {grade: 'C', remark: 'Fair'}
  } else if ((totalScore >= 40 && totalScore <= 49)) {
    return {grade: 'D', remark: 'Poor'}
  } else if ((totalScore >= 30 && totalScore <= 39)) {
    return {grade: 'E', remark: 'Very Poor'}
  } else if ((totalScore <= 29)) {
    return {grade: 'F', remark: 'Fail'}
  } else {
    return {grade: 'None', remark: 'No score'}
  }
}

async function calculateStudentAverage(val) {
  const {studentID, studentClass, term, year, testsAndExamTotal} = val;
  const allStudentInClass = await result.find({
    studentID,
    studentClass,
    year,
    term,
  }, "subject testsAndExamTotal");

  let total = 0;

  let subjectCount = allStudentInClass.length;
  
  console.log(allStudentInClass);
  
  for(let i = 0; i < allStudentInClass.length; i++) {
    total += allStudentInClass[i].testsAndExamTotal;
  }

  console.log("T", testsAndExamTotal);
  console.log("SC", subjectCount);

  const studentClassAverage = testsAndExamTotal / subjectCount;


  return studentClassAverage;

  // const createOrUpdatePosition = await studentPositionAndRemark.findOne({
  //   studentID,
  //   studentClass,
  //   year,
  //   term,
  // });

  // let neededPositionAndRemarks;

  // if(!createOrUpdatePosition) {
  //   neededPositionAndRemarks = await studentPositionAndRemark.create({
  //     studentID,
  //     studentClass,
  //     classTeacher,
  //     year,
  //     term,
  //     studentAverage: studentClassAverage
  //   });
  // } else {
  //   neededPositionAndRemarks = await studentPositionAndRemark.findOneAndUpdate({
  //     studentID,
  //     studentClass,
  //     classTeacher,
  //     year,
  //     term,
  //     studentAverage: studentClassAverage
  //   }, {new: true});
  // }


















  // const studentPosition = await studentPositionAndRemark.find({
  //   studentID,
  //   studentClass,
  //   year,
  //   term,
  // }).sort({
  //   studentAverage: "asc"
  // });

  // let position;

  // console.log(studentPosition);

  // for(let j=0; j < studentPosition.length; j++) {
  //   if(studentPosition.studentID == studentID) {
  //     position = j + 1;
  //   }
  // }


  // return neededPositionAndRemarks;

}

module.exports = {
  createUser,
  getUserByEmail,
  generateRandomFourDigits,
  getUserByUserId,
  comparePassword,
  generateRandomHex,
  generateOtp,
  msToTime,
  msToTimePadded,
  transporter,
  resultRemark,
  calculateStudentAverage,
  e };