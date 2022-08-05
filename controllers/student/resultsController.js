const { schoolFees } = require("../../models/feesModel");
const { result } = require("../../models/resultModel");
const { resultRemark } = require("../../utils/userUtil");

async function getResult(req, res) {
  const { year, term, studentClass } = req.body;
  const { id: studentID } = req.decoded;

  console.log("hello");

  let studentR = [];

  const paidFees = await schoolFees.findOne(
    {
      studentID,
      studentClass,
      term,
      year,
    },
    "term studentClass year payDate"
  );

  if (!paidFees) {
    res.status(404).json({
      message: "No schoolfees paid",
    });
  } else {
    const studentResults = await result
      .find({
        studentID,
        studentClass,
        term,
        year,
      })
      .populate("teacherID");

    if (studentResults.length == 0) {
      res.status(404).json({
        result: studentResults,
        message: "No result yet",
      });
    } else {
      for (let studentResult of studentResults) {
        const total =
          parseInt(studentResult.testOne) +
          parseInt(studentResult.testTwo) +
          parseInt(studentResult.testThree) +
          parseInt(studentResult.examScore);
        const resRem = resultRemark(total);
        let r = {};

        r.testOne = studentResult.testOne;
        r.testTwo = studentResult.testTwo;
        r.testThree = studentResult.testThree;
        r.examScore = studentResult.examScore;
        r.total = total;
        r.subject = studentResult.subject;
        r.term = studentResult.term;
        r.result = studentResult.result;
        r.grade = resRem.grade;
        r.remark = resRem.remark;
        r.teacherSurName = studentResult.teacherID.surName;
        r.teacherFirstName = studentResult.teacherID.firstName;
        r.teacherOtherNames = studentResult.teacherID.otherNames;
        r.teachergender = studentResult.teacherID.gender;
        studentR.push(r);
      }

      res.json({
        studentResults: studentR,
      });
    }
  }
}

module.exports = {
  getResult,
};
