const { usersDB } = require("../../models/usersModel");
const { studentPositionAndRemark } = require("../../models/positionAndRemarksModel");
const { result } = require("../../models/resultModel");

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

async function refreshStudentsResult(req, res) {
    const { id: teacherID } = req.decoded;
    const { year, term } = req.headers;

    let studentsResult = [];

    const teacherClass = await usersDB.findOne({
        _id: teacherID, role: "teacher"
    });
  
    let classStudents = await usersDB.find({
      studentClass: teacherClass.classTeacherOf,
    });

    let position = 1;

    for(let student of classStudents) {
        // let positionResponse = await studentPositionAndRemark.findOne({
        //     studentID: student._id,
        //     year,
        //     studentClass: teacherClass.classTeacherOf,
        //     term
        // });

        let studentGrandTotal = 0;
        let studentGrandAverage = 0;

        const studentSubjects = await result.find({
            studentID: student._id,
            studentClass: teacherClass.classTeacherOf,
            term, year
        });

        let studentsTotalSubjects = studentSubjects.length;

        // console.log(studentsTotalSubjects);

        for(let i = 0; i < studentSubjects.length; i++) {
            studentGrandTotal += studentSubjects[i].testsAndExamTotal;
        }

        studentGrandAverage = studentGrandTotal/studentsTotalSubjects;

        studentsResult.push({
            student,
            studentGrandTotal,
            studentGrandAverage: studentsTotalSubjects != 0 ? studentGrandAverage : 0,
            studentsTotalSubjects
        });

    }

    studentsResult = studentsResult.filter((result) => {
        return result.studentGrandAverage != 0 && result.studentGrandTotal != 0 && result.studentsTotalSubjects != 0;
    });

    studentsResult.sort(function(a, b) {
        return b.studentGrandAverage - a.studentGrandAverage;
    });

    for(let i = 1; i < studentsResult.length; i++) {
        if(studentsResult[i].studentGrandAverage == studentsResult[i - 1].studentGrandAverage) {
            studentsResult[i - 1].position = position;
        } else {
            studentsResult[i - 1].position = position;
            position++;
        }

        if(i == studentsResult.length - 1) {
            if(studentsResult[i].studentGrandAverage == studentsResult[i - 1].studentGrandAverage) {
                studentsResult[i].position = position;
            } else {
                studentsResult[i].position = position;
            }
        }

    }

    for(let i = 0; i < studentsResult.length; i++) {
        await studentPositionAndRemark.findOneAndUpdate({
            studentID: studentsResult[i].student._id,
            studentClass: teacherClass.classTeacherOf,
            term, year
        },
            {
                position:  studentsResult[i].position,
                studentAverage: studentsResult[i].studentGrandAverage,
                classTeacher: teacherClass._id,
                numberOfSubjectsOffered: studentsResult[i].studentsTotalSubjects,
                totalSubjectScores: studentsResult[i].studentGrandTotal
            },
        {
            upsert: true,
            setDefaultsOnInsert: true
        });
    }

    const allResult = await studentPositionAndRemark.find({
        studentClass: teacherClass.classTeacherOf,
            term, year
    }).pop;

    console.log(allResult);
    res.send(allResult);

}

module.exports = {
    getStudentsPosition,
    editPosition,
    refreshStudentsResult
};
