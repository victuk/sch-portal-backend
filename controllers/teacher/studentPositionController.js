const { usersDB } = require("../../models/usersModel");
const { studentPositionAndRemark } = require("../../models/positionAndRemarksModel");

async function getStudentsPosition(req, res) {
    const { year, term } = req.headers;

  const { id: teacherID } = req.decoded;

  let detail = [];

  const teacherClass = await usersDB.findOne({
      _id: teacherID, role: "teacher"
  });

  let classStudents = await usersDB.find({
    studentClass: teacherClass.classTeacherOf,
  });

  for(let student of classStudents) {
    let positionResponse = await studentPositionAndRemark.findOne({
        studentID: student._id,
        year,
        studentClass: teacherClass.classTeacherOf,
        term
    });

    console.log(student._id);
    console.log(teacherClass.classTeacherOf);
    console.log(year);
    console.log(term);

    if(!positionResponse) {
        let newP = {};

        newP.firstName = student.firstName;
        newP.surName = student.surName;
        newP.otherNames = student.otherNames;
        newP.gender = student.gender;
        newP.position = "Not set";
        newP.mode = "create";
        newP.studentID = student._id;
        newP.studentClass = student.studentClass;
        newP.recordID = "none";

        detail.push(newP);
    } else {
        let studentP = {};

        studentP.firstName = student.firstName;
        studentP.surName = student.surName;
        studentP.otherNames = student.otherNames;
        studentP.gender = student.gender;
        studentP.position = positionResponse.position;
        studentP.mode = "update";
        studentP.studentID = student._id;
        studentP.studentClass = student.studentClass;
        studentP.recordID = positionResponse._id;

        detail.push(studentP);
    }
  }

  res.json({
    positions: detail,
  });
}

async function editPosition(req, res) {
    const {
        studentID,
        recordID,
        recordMode,
        newPosition,
        studentClass,
        year,
        term
    } = req.body;

    const { id: teacherID } = req.decoded;

    if(recordMode == "create") {
        const newRecord = await studentPositionAndRemark.create({
            studentID,
            classTeacher: teacherID,
            studentClass,
            year,
            position: newPosition,
            term
        });

        res.send(newRecord);

    } else if (recordMode == "update") {
        const updatedRecord = await studentPositionAndRemark.findByIdAndUpdate(recordID, {
            studentID,
            classTeacher: teacherID,
            studentClass,
            year,
            position: newPosition,
            term
        });

        res.send(updatedRecord);
    }

}

module.exports = {
    getStudentsPosition,
    editPosition
};
