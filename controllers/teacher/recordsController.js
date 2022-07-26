const { result } = require('../../models/resultModel');
const { usersDB } = require('../../models/usersModel');
const { resultRemark } = require('../../utils/userUtil');

async function getStudentsResults(req, res) {
    const {
        year,
        studentClass,
        term,
        subject
    } = req.body;

    const {id: teacherID} = req.decoded;

    let detail = [];

    let classStudents = await usersDB.find({
        studentClass
    });

    for (let student of classStudents) {
        let resultResponse = await result.findOne({year, studentClass, term, subject});
        
        if(resultResponse == []) {
            let newR = await result.create({
                studentID: student._id,
                teacherID,
                studentClass: student.studentClass,
                term,
                subject,
                year,
                resultRemark: 'None'
            });

            const total = parseInt(newR.testOne) + parseInt(newR.testTwo) + parseInt(newR.testThree) + parseInt(newR.examScore);
            
            const remarks = resultRemark(total);

            newR.remark = remarks.remark;

            newR.grade = remarks.grade;

            detail.push(newR);
        } else {
            const total = parseInt(resultResponse.testOne) + parseInt(resultResponse.testTwo) + parseInt(resultResponse.testThree) + parseInt(resultResponse.examScore);
            
            const remarks = resultRemark(total);

            resultResponse.remark = remarks.remark;

            resultResponse.grade = remarks.grade;

            detail.push(resultResponse);
        }
    }
    res.json({
        results: detail
    });
}

async function editRecord(req, res) {
    let {
        recordID,
        testOne,
        testTwo,
        testThree,
        examScore
    } = req.body;
    const {id: teacherID} = req.decoded;

    testOne = testOne || 0;
    testTwo = testTwo || 0;
    testThree = testThree || 0;
    examScore = examScore || 0;

    let total = parseInt(testOne) + parseInt(testTwo) + parseInt(testThree) + parseInt(examScore);

    const updatedRecord = await result.findOneAndUpdate({_id: recordID, teacherID}, {
        testOne,
        testTwo,
        testThree,
        examScore
    });

    res.json({
        updatedRecord,
        total
    });
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
    const {id: studentID} = req.params;
    const {id: teacherID} = req.decoded;

    const studentDetails = result.findOne({studentID, teacherID}).populate(studentID, 'firstName surName otherNames gender studentClass');

    res.json({
        studentDetails
    });
}

async function deleteRecord(req, res) {
    const { id: recordID } = req.params;
    const { id: teacherID } = req.decoded;

    const records = await result.findOneAndDelete({_id: recordID, teacherID});

    res.json({
        deletedRecordID: records._id
    });
}

async function searchByName(req, res) {
    const { firstName, surName } = req.params;
  
    const searchResult = await usersDB.find({firstName, surName});
  
    res.json({
      searchResult
    });
  }

module.exports = {
    getStudentsResults,
    editRecord,
    searchByName,
    specificStudentDetail,
    deleteRecord
};
