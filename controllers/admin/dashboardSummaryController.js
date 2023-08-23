const { usersDB } = require("../../models/usersModel");

async function totalStudentsPerClass(req, res) {

    let summary = {};

    for(i = 1; i <= 3; i++) {
        const theCount = `js${i}Count`;
        summary[theCount] = await usersDB.find({studentClass: `js${i}`, role: "student", admitted: true}).count();
    }

    for(i = 1; i <= 3; i++) {
        const theCount = `ss${i}Count`;
        summary[theCount] = await usersDB.find({studentClass: `ss${i}`, role: "student", admitted: true}).count();
    }
    res.json({ summary });
}

module.exports = { totalStudentsPerClass };
