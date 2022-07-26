const { schoolFees } = require('../../models/feesModel');
const { schoolFeesSelector } = require('../../models/feesSelectorModel');


function verifyPayment(req, res) {
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

module.exports = {
    verifyPayment
};
