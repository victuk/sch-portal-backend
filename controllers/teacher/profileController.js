const { usersDB } = require('../../models/usersModel');

async function getTeacherProfile(req, res) {
    const {id: teacherID} = req.decoded;

    const teacher = await usersDB.findOne({_id: teacherID, role: 'teacher'},
    'firstName surName otherNames gender passportPicture passportPublicId email subjectsClass phoneNumber');

    res.json({
        teacherDetails: teacher
    });
}

module.exports = {
    getTeacherProfile
};
