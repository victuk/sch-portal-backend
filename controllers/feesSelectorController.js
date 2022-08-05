const { usersDB } = require('../models/usersModel');
const { schoolFees } = require('../models/feesModel');

function replyForFees(req, res, newStudent, alreadyPaid, studentClass) {
    if(!alreadyPaid) {
        if(newStudent == true) {
            if(studentClass == 'js1') {
                res.json({
                    fee: 70000
                });
            } else if (studentClass == 'js2') {
                res.json({
                    fee: 70000
                });
            } else if (studentClass == 'js3') {
                res.json({
                    fee: 70000
                });
            } else if (studentClass == 'ss1') {
                res.json({
                    fee: 70000
                });
            } else if (studentClass == 'ss2') {
                res.json({
                    fee: 70000
                });
            } else if (studentClass == 'ss3') {
                res.json({
                    fee: 70000
                });
            } else {
                return
            }
        } else {
            if(studentClass == 'js1') {
                res.json({
                    fee: 50000
                });
            } else if (studentClass == 'js2') {
                res.json({
                    fee: 50000
                });
            } else if (studentClass == 'js3') {
                res.json({
                    fee: 50000
                });
            } else if (studentClass == 'ss1') {
                res.json({
                    fee: 50000
                });
            } else if (studentClass == 'ss2') {
                res.json({
                    fee: 50000
                });
            } else if (studentClass == 'ss3') {
                res.json({
                    fee: 120000
                });
            } else {
                return;
            }
        }
    } else {
        res.status(202).json({
            message: 'Already Paid',
            paymentDetails: alreadyPaid
        });
    }
}

async function selectFee(req, res) {
    const {
        studentClass,
        studentTerm,
        studentYear
    } = req.body;
    const {id: studentID} = req.decoded;

    const {newStudent} = await usersDB.findOne({_id:studentID, role: 'student'}, 'newStudent');


    const alreadyPaid = await schoolFees.findOne({
        studentID,
        term: studentTerm,
        studentClass,
        year: studentYear
    }, 'term studentClass year amount payDate');

    replyForFees(req, res, newStudent, alreadyPaid, studentClass);
    
}

async function forParents(req, res) {
    const {
        studentClass,
        studentTerm,
        studentYear
    } = req.body;
    const {id: studentID} = req.params;

    

    const {newStudent} = await usersDB.findOne({_id:studentID, role: 'student'}, 'newStudent');


    const alreadyPaid = await schoolFees.findOne({
        studentID,
        term: studentTerm,
        studentClass,
        year: studentYear
    }, 'term studentClass year amount payDate');

    replyForFees(req, res, newStudent, alreadyPaid, studentClass);
}

module.exports = {
    selectFee,
    forParents
};