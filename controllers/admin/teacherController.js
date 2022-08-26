const { usersDB } = require("../../models/usersModel");
const {
    generateRandomHex,
    transporter
} = require('../../utils/userUtil');

async function sendTheMail(options) {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log('An error occoured while trying to send the mail.');
  }
}

function sendEmail(req, res, email, vToken, pw) {
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
                          
                          <div>
                          Your login details after verifying your email is:
                          <div>Email: ${email}</div>
                          <div>Password: ${pw}</div>
                          </div>

                        <style>
                              div, a {
                                padding: 20px 10px;
                              }
                        </style>
                    </div>
                    `,
    };
      sendTheMail(mailOptions);

  }

async function addTeacher(req, res) {
    const {
        firstName,
        surName,
        otherNames,
        gender,
        passportPicture,
        passportPublicId,
        email,
        // dateOfBirth,
        stateOfOrigin,
        localGovernmentOfOrigin,
        subjectsClass,
        phoneNumber,
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
        localGovernmentOfOrigin &&
        email
      ) {
        req.body.role = "teacher";
        const userPassword = generateRandomHex(6);
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userPassword, salt);
        req.body.password = hashedPassword;
        const vToken = cryptojs.AES.encrypt(email, cryptoKey).toString();
    
        const newUser = new usersDB(req.body);
        await newUser.save();
        sendEmail(req, res, email, vToken, userPassword);
    
        res.status(201).json({
          message: "teacher created.",
          vToken,
        });
      } else {
        console.log(req.body);
        res.status(400).json({
          message: "Incomplete user details.",
        });
      }
}

async function searchTeacherByName(req, res) {
  const { firstName, surName } = req.params;

  const searchResult = await usersDB.find({firstName, surName, role: 'teacher'}, 'firstName surName otherNames gender passportPicture passportPublicId subjectsClass stateOfOrigin category email role classTeacherOf createdAt updatedAt');

  res.json({
    searchResult
  });
}

async function searchTeacherByEmail(req, res) {
  const { email } = req.params;

  const searchResult = await usersDB.find({email, role: 'teacher'}, 'firstName surName otherNames gender passportPicture passportPublicId subjectsClass stateOfOrigin localGovernmentOfOrigin email role classTeacherOf createdAt updatedAt');

  res.json({
    searchResult
  });
}

async function specificTeacher(req, res) {
  const { id: teacherID } = req.params;

  const teacherDetails = await usersDB.findById(teacherID, 'firstName surName otherNames gender passportPicture passportPublicId subjectsClass stateOfOrigin localGovernmentOfOrigin email role classTeacherOf createdAt updatedAt');
  res.json({
    teacherDetails
  });
}

async function getEveryTeacher(req, res) {
  const searchResult = await usersDB.find({role: 'teacher'}, 'firstName surName otherNames gender passportPicture passportPublicId subjectsClass stateOfOrigin localGovernmentOfOrigin email role classTeacherOf createdAt updatedAt');

  res.json({
    searchResult
  });
}

// async function changeTeacherDetails(req, res) {
//   const {
//       firstName,
//       surName,
//       otherNames,
//       gender,
//       passportPicture,
//       passportPublicId,
//       email,
//       classTeacherOf,
//       subjectsClass,
//       stateOfOrigin,
//       localGovernmentOfOrigin
//     } = req.body;

//     const {id: studentID} = req.params;

//   if (
//       firstName &&
//       surName &&
//       otherNames &&
//       gender &&
//       passportPicture &&
//       passportPublicId &&
//       email &&
//       classTeacherOf &&
//       subjectsClass &&
//       stateOfOrigin &&
//       localGovernmentOfOrigin) {
//     await usersDB.findByIdAndUpdate(studentID, {
//       firstName,
//       surName,
//       otherNames,
//       gender,
//       passportPicture,
//       passportPublicId,
//       email,
//       classTeacherOf,
//       subjectsClass,
//       stateOfOrigin,
//       localGovernmentOfOrigin
//     });

//     res.json({
//       message: "Student detail updated successfully.",
//     });
//   } else {
//     res.status(400).json({
//       message: "Incomplete details.",
//     });
//   }
// }

module.exports = {
    addTeacher,
    searchTeacherByName,
    searchTeacherByEmail,
    specificTeacher,
    getEveryTeacher
};