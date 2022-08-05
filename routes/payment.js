var express = require('express');
var router = express.Router();

const {
    hasAccess
} = require('../authenticationMiddlewares/accessControl');

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

const {
    verifyPayment,
    verifyParentPayment,
    studentReceipts,
    specificReceipt,
    getStudentByEmail,
    receiptByStudentID
} = require('../controllers/paymentController');

const { selectFee, forParents } = require('../controllers/feesSelectorController');

router.post('/student', getStudentByEmail);
router.post('/parent-summary/:id', forParents);
router.post('/verify-parent-payment/:id', verifyParentPayment);

router.use(checkLoggedIn);
router.use(isRestricted);

// Fee payment procedure for students
router.post('/get-summary', hasAccess.student, selectFee);
router.post('/verify-payment', hasAccess.student, verifyPayment);

// Retrieving receipts
router.get('/receipt-list/:studentClass/:term/:year', studentReceipts);
router.get('/receipt/:studentID/:studentClass/:term/:year', specificReceipt);

// For admins
router.get('/receipt-by-id/:studentID', hasAccess.admin, receiptByStudentID);

module.exports = router;
