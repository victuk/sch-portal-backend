const { schoolFees } = require('../models/feesModel');
const { schoolFeesSelector } = require('../models/feesSelectorModel');
const { usersDB } = require('../models/usersModel'); 
const axios = require('axios');
const payStackSecretKey = process.env.paystackSecretKey;

async function verifyPayment(req, res) {
    const { referenceID } = req.body;
    const { id: studentID } = req.decoded;

    try {
        const response = await axios.get(
            "https://api.paystack.co/transaction/verify/" + referenceID,
            {
              headers: {
                Authorization: "Bearer " + payStackSecretKey,
              },
            }
          );

          console.log(response.data.data);

          if(response.status = true) {
              if(response.data.data.metadata.newStudent == true) {
                await usersDB.findOneAndUpdate({
                    _id: studentID,
                    role: 'student'
                }, {
                    newStudent: false
                });
              }

              await schoolFees.create({
                 studentID,
                 referenceID,
                 amount: response.data.data.amount / 100,
                 term: response.data.data.metadata.termValue,
                 studentClass: response.data.data.metadata.classValue,
                 year: response.data.data.metadata.yearValue,
                 payDate: response.data.data.paidAt,
                 metaDetails: response.data.data.metadata,
                 splitDetails: response.data.data.split
              });
          }

          res.status(200).json({message: 'School fees paid successfully'});
          
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Payment failed.'
        });
    }
}

async function verifyParentPayment(req, res) {
    const { referenceID } = req.body;
    const { id: studentID } = req.params;

    try {
        const response = await axios.get(
            "https://api.paystack.co/transaction/verify/" + referenceID,
            {
              headers: {
                Authorization: "Bearer " + payStackSecretKey,
              },
            }
          );

          console.log(response.data.data);

          if(response.status = true) {
              if(response.data.data.metadata.newStudent == true) {
                await usersDB.findOneAndUpdate({
                    _id: studentID,
                    role: 'student'
                }, {
                    newStudent: false
                });
              }

              await schoolFees.create({
                 studentID,
                 referenceID,
                 amount: response.data.data.amount / 100,
                 term: response.data.data.metadata.termValue,
                 studentClass: response.data.data.metadata.classValue,
                 year: response.data.data.metadata.yearValue,
                 payDate: response.data.data.paidAt,
                 metaDetails: response.data.data.metadata,
                 splitDetails: response.data.data.split
              });
          }

          res.status(200).json({message: 'School fees paid successfully'});
          
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Payment failed.'
        });
    }
}

async function studentReceipts(req, res) {
    const { id: studentID } = req.decoded;

    const feesReceiptArray = await schoolFees.find({studentID});

    res.status(200).json({receipts: feesReceiptArray});
}

async function specificReceipt(req, res) {
    const {referenceID} = req.body;
    const { id: studentID } = req.decoded;

    const feesReceipt = await schoolFees.findOne({studentID, referenceID});

    res.status(200).json({receipt: feesReceipt});
}

async function receiptByStudentID(req, res) {
    const {studentID} = req.params;
    const feesReceipt = await schoolFees.find({studentID}).sort({payDate: -1});
    res.status(200).json({receipt: feesReceipt});
}

async function getSummary(req, res) {
    const {studentClass} = req.body;
    const paymentDetails =  schoolFeesSelector.findOne(studentClass, 'amount studentClass');

    res.json({
        paymentDetails
    });
}


async function getStudentByEmail(req, res) {
    const {studentEmail} = req.body;

    const student = await usersDB.findOne({email: studentEmail, role: "student"}, "firstName surName otherNames gender passportPicture passportPublicId parentEmail parentPhone studentClass newStudent parentName stateOfOrigin localGovernmentOfOrigin category email role createdAt updatedAt");

    if(!student) {
        res.status(404).json({
            message: "Can't find a student with this email."
        });
    } else if(student.emailVerified == false) {
        res.status(404).json({
            message: "Kindly verify your email."
        });
    } else if(student.suspended == true) {
        res.status(404).json({
            message: "You have been suspended by the admin, kindly meet the admin to resolve this problem."
        });
    } else {
        res.json({
            student
        });
    }
}

module.exports = {
    verifyPayment,
    verifyParentPayment,
    studentReceipts,
    specificReceipt,
    getSummary,
    getStudentByEmail,
    receiptByStudentID
};
