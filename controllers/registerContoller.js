const { usersDB } = require("../models/usersModel");
const { settings } = require("../models/settingsModel");
const bcrypt = require("bcryptjs");
const { transporter, generateRandomHex } = require("../utils/userUtil");
require("dotenv").config();
const cryptojs = require("crypto-js");
const cryptoKey = process.env.cryptoSecret;

async function sendTheMail(options) {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log('An error occoured while trying to send the mail.');
  }
}

function sendEmail(req, res, email, vToken) {
  var mailOptions = {
    from: "School <no-reply@school.com>",
    to: email,
    subject: `School - Email Verification`,
    html: `
                  <div style="padding: 20px">
                      <h1 style="background-color: blue; white: color: white;">Click here to verify your email</h1>
                      Link to verify: ${req.headers.host}/verify-email?vtoken=${vToken}
  
                        <div>
                        <a href="${req.headers.host}/verify-email?vtoken=${vToken}">Verify</a>
                        </div>
                      <style>
                            div, a {
                              padding: 20px 10px;
                            }
                      </style>
                  </div>
                  `,
  };
  try {
    sendTheMail(mailOptions);
  } catch (error) {
    console.log("Can't send emails.");
  }
}

async function registerTeacher(req, res) {
  const {
    firstName,
    surName,
    otherNames,
    gender,
    passportPicture,
    passportPublicId,
    email,
    stateOfOrigin,
    classTeacherOf,
    localGovernmentOfOrigin,
    subjectsClass,
    phoneNumber,
    password
  } = req.body;

  if (
    firstName &&
    surName &&
    otherNames &&
    gender &&
    passportPicture &&
    passportPublicId &&
    subjectsClass &&
    phoneNumber &&
    stateOfOrigin &&
    classTeacherOf &&
    localGovernmentOfOrigin &&
    email &&
    password
  ) {

    try {
      req.body.role = "teacher";
    req.body.suspended = false;
    req.body.emailVerified = false;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;
    const vToken = cryptojs.AES.encrypt(email, cryptoKey).toString();

    const newUser = new usersDB(req.body);
    await newUser.save();
    sendEmail(req, res, email, vToken);

    res.status(201).json({
      message: "teacher created.",
      vToken,
    });
    } catch (error) {
      if(error.name == "MongoError") {
        console.log(error);
        res.status(400).json({
          message: "Email already registered."
        });
      } else {
        res.status(400).json({
          message: "An error occurred."
        });
      }
    }
  } else {
    console.log(req.body);
    res.status(400).json({
      message: "Incomplete user details.",
    });
  }
}

async function registerStudents(req, res) {
  const {
    firstName,
    surName,
    otherNames,
    gender,
    passportPicture,
    passportPublicId,
    parentEmail,
    parentPhone,
    studentClass,
    dateOfBirth,
    parentName,
    stateOfOrigin,
    category,
    localGovernmentOfOrigin,
    email,
    password
  } = req.body;

  if (
    firstName &&
    surName &&
    otherNames &&
    gender &&
    passportPicture &&
    passportPublicId &&
    parentEmail &&
    parentPhone &&
    studentClass &&
    dateOfBirth &&
    parentName &&
    stateOfOrigin &&
    localGovernmentOfOrigin &&
    category &&
    email &&
    password
  ) {
    try {
      const getAdmissionSetting = await settings.find();
    req.body.suspended = false;
    req.body.emailVerified = false;
    req.body.newStudent = true;
    req.body.admitted = false;
    req.body.role = "student";
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;

    const vToken = cryptojs.AES.encrypt(email, cryptoKey).toString();
    const availableClasses = ["a", "b", "c"];
    const len = availableClasses.length + 1;
    req.body.classDivision = availableClasses[Math.floor(Math.random() * len)];
    req.body.admissionTerm = getAdmissionSetting[0].currentTerm;
    req.body.admissionYear = getAdmissionSetting[0].currentYear;
    let classCount = await usersDB.find({
      studentClass, admissionYear: getAdmissionSetting[0].currentYear
    }).countDocuments();

    
    
    let alreadyExists = true;
    let mainCount = parseInt(classCount);
    
    while(alreadyExists == true) {
      let admissionStr = `${getAdmissionSetting[0].currentYear.split("/")[0]}${req.body.studentClass.includes("j") ? "j" : "s"}${parseInt(mainCount + 1)}`;
      let usersWithAdmissionNumber = await usersDB.find({admissionNumber: admissionStr}).countDocuments();
      
      if(usersWithAdmissionNumber == 0) {
        alreadyExists = false;
        req.body.admissionNumber = admissionStr;
      } else {
        mainCount++;
      }
    }

    const newUser = new usersDB(req.body);
    await newUser.save();
    
    sendEmail(req, res, email, vToken);

    res.status(201).json({
      message: "Student created.",
      vToken,
    });
    } catch (error) {
      console.log(error.name);
      if(error.name == "MongoError") {
        console.log(error);
        res.status(400).json({
          message: "Email already registered."
        });
      } else {
        res.status(400).json({
          message: "An error occurred."
        });
      }
    }
  } else {
    res.json({message: "Incomplete input"});
  }
}

async function registerAdmins(req, res) {
  const {
    firstName,
    surName,
    otherNames,
    gender,
    passportPicture,
    passportPublicId,
    email,
    password,
  } = req.body;

  if (
    firstName &&
    surName &&
    otherNames &&
    gender &&
    passportPicture &&
    passportPublicId &&
    email &&
    password
  ) {
    req.body.role = "admin";
    req.body.suspended = false;
    req.body.emailVerified = false;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password.toString(), salt);
    req.body.password = hashedPassword;
    const vToken = cryptojs.AES.encrypt(email, cryptoKey).toString();
    const newUser = new usersDB(req.body);
    await newUser.save();
    sendEmail(req, res, email, vToken);

    res.status(201).json({
      message: "Admin created.",
      vToken,
    });
  }
}

async function registerScoresUploader(req, res) {
  const {
    firstName,
    surName,
    otherNames,
    email,
    password
  } = req.body;

  if(firstName &&
    surName &&
    otherNames &&
    email &&
    password) {

    req.body.role = "recordkeeper";
    req.body.suspended = false;
    req.body.emailVerified = true;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password.toString(), salt);
    req.body.password = hashedPassword;
    const newUser = new usersDB(req.body);
    await newUser.save();

    res.status(201).json({
      message: "New record keeper created.",
      vToken,
    });

  } else {
    res.json({message: "Incomplete details"});
  }

}

module.exports = {
  registerTeacher,
  registerStudents,
  registerAdmins,
  registerScoresUploader
};
