const { usersDB } = require("../../models/usersModel");
const { schoolFees } = require("../../models/feesModel");

async function changeDetails(req, res) {
  const {
    firstName,
    surName,
    otherNames,
    gender,
    parentEmail,
    parentPhone,
    studentClass,
    parentName,
    stateOfOrigin,
    localGovernmentOfOrigin,
    category,
  } = req.body;

  const { id: studentID } = req.params;

  if (
    firstName &&
    surName &&
    otherNames &&
    gender &&
    parentEmail &&
    parentPhone &&
    studentClass &&
    parentName &&
    stateOfOrigin &&
    localGovernmentOfOrigin &&
    category
  ) {
    await usersDB.findByIdAndUpdate(studentID, {
      firstName,
      surName,
      otherNames,
      gender,
      parentEmail,
      parentPhone,
      studentClass,
      parentName,
      parentEmail,
      parentPhone,
      stateOfOrigin,
      localGovernmentOfOrigin,
      category,
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
  const allStudents = await usersDB.find(
    { role: "student" },
    "firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt"
  );
  const studentsCount = allStudents.length;
  res.json({
    allStudents,
    studentsCount,
  });
}

async function specificStudent(req, res) {
  const { id: studentID } = req.params;

  const studentDetails = await usersDB.findById(
    studentID,
    "firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt"
  );
  res.json({
    studentDetails,
  });
}

async function searchByName(req, res) {
  const { firstName, surName } = req.params;

  let searchResult;

  if(surName == "undefined") {
    searchResult = await usersDB.find(
      { firstName: new RegExp(firstName, 'i'), role: "student" },
      "firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt"
    );
  } else {
    searchResult = await usersDB.find(
      { firstName: new RegExp(firstName, 'i'), surName: new RegExp(surName, 'i'), role: "student" },
      "firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt"
    );
  }

  res.json({
    searchResult,
  });
}

async function searchByEmail(req, res) {
  const { email } = req.params;

  const searchResult = await usersDB.find(
    { email, role: "student" },
    "firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt"
  );

  res.json({
    searchResult,
  });
}

async function getStudentReceipts(req, res) {
  const { id: studentID } = req.params;

  const studentReceipts = await schoolFees.find(
    { studentID },
    "studentID term amount referenceID studentClass year payDate"
  );

  res.json({ studentReceipts });
}

async function getFeeReceiptById(req, res) {
  const { id: receiptID } = req.params;

  const studentReceipt = await schoolFees.findById(
    receiptID,
    "studentID term amount referenceID studentClass year payDate"
  );

  res.json({ studentReceipt });
}

async function editReceipt(req, res) {
  const { id: receiptID } = req.params;
  const { term, studentClass, year } = req.body;
  try {
    await schoolFees.findByIdAndUpdate(receiptID, {
      term,
      studentClass,
      year,
    });
    res.json({ message: "Update Successful." });
  } catch (error) {
    res.status(400).json({ message: "Update Failed." });
  }
}

// async function addResultRemark(req, res) {

// }

// async function deleteResultRemark(req, res) {

// }

module.exports = {
  changeDetails,
  showStudents,
  specificStudent,
  searchByName,
  searchByEmail,
  getStudentReceipts,
  getFeeReceiptById,
  editReceipt,
};
