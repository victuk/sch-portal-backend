const { usersDB } = require("../../models/usersModel");

async function changeDetails(req, res) {
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
      parentName,
      stateOfOrigin,
      localGovernmentOfOrigin,
      category
    } = req.body;

    const {id: studentID} = req.params;

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
    parentName &&
    stateOfOrigin &&
    localGovernmentOfOrigin &&
    category) {
    await usersDB.findByIdAndUpdate(studentID, {
      firstName,
      surName,
      otherNames,
      gender,
      passportPicture,
      passportPublicId,
      parentEmail,
      parentPhone,
      studentClass,
      parentName,
      parentEmail,
      parentPhone,
      stateOfOrigin,
      localGovernmentOfOrigin,
      category
    });

    res.json({
      message: "Student detail updated successfully.",
    });
  } else {
    res.status(400).json({
      message: "Incomplete details.",
    });
  }
}

async function showStudents(req, res) {
  const allStudents = await usersDB.find({role: "student"}, 'firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt');
  const studentsCount = allStudents.length;
  res.json({
    allStudents,
    studentsCount
  });
}

async function specificStudent(req, res) {
  const { id: studentID } = req.params;

  const studentDetails = await usersDB.findById(studentID, 'firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt');
  res.json({
    studentDetails
  });
}

async function searchByName(req, res) {
  const { firstName, surName } = req.params;

  const searchResult = await usersDB.find({firstName, surName, role: 'student'}, 'firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt');

  res.json({
    searchResult
  });
}

async function searchByEmail(req, res) {
  const { email } = req.params;

  const searchResult = await usersDB.find({email, role: 'student'}, 'firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt');

  res.json({
    searchResult
  });
}

module.exports = {
  changeDetails,
  showStudents,
  specificStudent,
  searchByName,
  searchByEmail
};
