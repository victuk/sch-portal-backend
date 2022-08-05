const { result } = require("../../models/resultModel");
const { usersDB } = require("../../models/usersModel");
const { resultRemark } = require("../../utils/userUtil");

async function getStudentsResults(req, res) {
  const { year, studentClass, term, subject } = req.body;

  const { id: teacherID } = req.decoded;

  let detail = [];

  let classStudents = await usersDB.find({
    studentClass,
  });

  for (let student of classStudents) {
    let resultResponse = await result.findOne({
      studentID: student._id,
      year,
      studentClass,
      term,
      subject,
    });

    if (!resultResponse) {
      let newR = {};

      newR.firstName = student.firstName;
      newR.surName = student.surName;
      newR.otherNames = student.otherNames;
      newR.gender = student.gender;
      newR.passportPicture = student.passportPicture;
      newR.passportPublicId = student.passportPublicId;
      newR.studentClass = student.studentClass;
      newR.studentID = student._id;
      newR.teacherID = teacherID;
      newR.studentClass = student.studentClass;
      newR.subject = subject;
      newR.term = term;
      newR.year = year;
      newR.testOne = 0;
      newR.testTwo = 0;
      newR.testThree = 0;
      newR.examScore = 0;
      newR.total = 0;
      newR.remark = "No record";
      newR.grade = "None";
      newR.mode = "create";

      detail.push(newR);
    } else {
      const total =
        parseInt(resultResponse.testOne) +
        parseInt(resultResponse.testTwo) +
        parseInt(resultResponse.testThree) +
        parseInt(resultResponse.examScore);

      const remarks = resultRemark(total);

    let updatedR = {};
      
      updatedR.firstName = student.firstName;
      updatedR.surName = student.surName;
      updatedR.otherNames = student.otherNames;
      updatedR.gender = student.gender;
      updatedR.passportPicture = student.passportPicture;
      updatedR.passportPublicId = student.passportPublicId;
      updatedR.studentClass = student.studentClass;
      updatedR.remark = remarks.remark;
      updatedR.subject = subject;
      updatedR.term = term;
      updatedR.year = year;
      updatedR.total = total;
      updatedR.mode = "update";
      updatedR.studentID = student._id;
      updatedR.teacherID = teacherID;
      updatedR.grade = remarks.grade;
      updatedR.testOne = resultResponse.testOne
      updatedR.testTwo = resultResponse.testTwo
      updatedR.testThree = resultResponse.testThree
      updatedR.examScore = resultResponse.examScore
      detail.push(updatedR);
    }
  }
  res.json({
    results: detail,
  });
}

async function editRecord(req, res) {
  let {
      recordMode,
      testOne,
      testTwo,
      testThree,
      examScore,
      subject,
      term,
      studentClass,
      year
    } = req.body;

  const { id: teacherID } = req.decoded;
  const {id: studentID} = req.params;

  let studentUpdatedRecord;

  let student = await usersDB.findById(studentID);

  if(recordMode == "create") {
    studentUpdatedRecord = await result.create({
        studentID,
        teacherID,
        testOne,
        testTwo,
        testThree,
        examScore,
        subject,
        term,
        studentClass,
        year
      });
  } else if(recordMode == "update") {
    studentUpdatedRecord = await result.findOneAndUpdate({
        term,
        studentClass,
        year,
        subject,
        studentID,
        teacherID
    }, {
        testOne,
        testTwo,
        testThree,
        examScore
    },
    {new: true});
  }
     let updated = {};

     const tOne = studentUpdatedRecord.testOne;
     const tTwo = studentUpdatedRecord.testTwo;
     const tThree = studentUpdatedRecord.testThree;
     const eScore = studentUpdatedRecord.examScore;
     
     let total =
    parseInt(tOne) +
    parseInt(tTwo) +
    parseInt(tThree) +
    parseInt(eScore);

    const remarks = resultRemark(total);

      updated.firstName = student.firstName;
      updated.surName = student.surName;
      updated.otherNames = student.otherNames;
      updated.gender = student.gender;
      updated.passportPicture = student.passportPicture;
      updated.passportPublicId = student.passportPublicId;
      updated.studentClass = student.studentClass;
      updated.testOne = studentUpdatedRecord.testOne;
      updated.testTwo = studentUpdatedRecord.testTwo;
      updated.testThree = studentUpdatedRecord.testThree;
      updated.examScore = studentUpdatedRecord.examScore;
      updated.remark = remarks.remark;
      updated.grade = remarks.grade;
      updated.subject = subject;
      updated.studentID = studentID;
      updated.teacherID = teacherID;
      updated.total = total;
      updated.recordMode = "update";

    console.log(student);
    console.log(updated);

  res.json({resultResponse: updated});
}

// function addRecord(req, res) {
//     let {
//         subject,
//         term,
//         testOne,
//         testTwo,
//         year,
//         testThree,
//         examScore
//     } = req.body;

//     testOne = testOne || 0;
//     testTwo = testTwo || 0;
//     testThree = testThree || 0;
//     examScore = examScore || 0;

//     let total = parseInt(testOne) + parseInt(testTwo) + parseInt(testThree) + parseInt(examScore);

//     const newEntry = await result.create({
//         subject,
//         term,
//         testOne,
//         testTwo,
//         year,
//         testThree,
//         examScore
//     });

//     res.json({
//         newEntry,
//         total
//     });
// }

function specificStudentDetail(req, res) {
  const { id: studentID } = req.params;
  const { id: teacherID } = req.decoded;

  const studentDetails = result
    .findOne({ studentID, teacherID })
    .populate(studentID, "firstName surName otherNames gender studentClass");

  res.json({
    studentDetails,
  });
}

async function deleteRecord(req, res) {
  const { id: recordID } = req.params;
  const { id: teacherID } = req.decoded;

  const records = await result.findOneAndDelete({ _id: recordID, teacherID });

  res.json({
    deletedRecordID: records._id,
  });
}

async function searchByName(req, res) {
  const { firstName, surName } = req.params;

  const searchResult = await usersDB.find({ firstName, surName });

  res.json({
    searchResult,
  });
}

module.exports = {
  getStudentsResults,
  editRecord,
  searchByName,
  specificStudentDetail,
  deleteRecord,
};
