const { usersDB } = require("../../models/usersModel");

async function getStudentProfile(req, res) {
    const {id: studentID} = req.decoded;

    const studentDetails = await usersDB.findById(studentID, 'firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass newStudent parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt');

    res.json({
        studentDetails
    });
}

function getStudentEmail(req, res) {
    const {email: studentEmail} = req.decodedUserDetails;

    res.json({
        studentEmail
    });
}

// function editDetails(req, res) {

// }

module.exports = {
    getStudentProfile,
    getStudentEmail
};