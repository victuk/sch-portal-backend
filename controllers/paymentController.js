const { schoolFees } = require('../models/feesModel');
const { schoolFeesSelector } = require('../models/feesSelectorModel');

async function verifyPayment(req, res) {
    const { referenceID, paymentDetails } = req.body;
    const { id } = req.decoded;

    try {
        const response = await axios.get(
            "https://api.paystack.co/transaction/verify/" + referenceID,
            {
              headers: {
                Authorization: "Bearer " + payStackSecretKey,
              },
            }
          );

          res.status(200).json({response});
          
        //   const electionDetails = await election.findById(electionID)
        //   .populate("adminID", "fullName email verified schoolName");
    } catch (error) {
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

async function getSummary(req, res) {
    const {studentClass} = req.body;
    const paymentDetails =  schoolFeesSelector.findOne(studentClass, 'amount studentClass');

    res.json({
        paymentDetails
    });
}

module.exports = {
    verifyPayment,
    studentReceipts,
    specificReceipt,
    getSummary
};
