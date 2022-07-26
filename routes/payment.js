var express = require('express');
var router = express.Router();

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

const {
    verifyPayment,
    studentReceipts,
    specificReceipt,
    getSummary
} = require('../controllers/paymentController');

router.use(checkLoggedIn);
router.use(isRestricted);

router.post('/get-summary', getSummary);

router.get('/payment-proofs/:studentID', studentReceipts);
router.get('/payment-proof/:studentID', specificReceipt);
router.post('/verify-payments', verifyPayment);

module.exports = router;
