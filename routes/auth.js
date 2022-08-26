var express = require('express');
var router = express.Router();

const {
    registerStudents,
    registerTeacher,
    registerAdmins
} = require('../controllers/registerContoller');
const { login } = require('../controllers/loginController');
const { verifyEmail, checkIfEmailAlreadyExist } = require('../controllers/verifyEmailController');
const {
    forgetPassword,
    resetPassword
} = require('../controllers/forgotPasswordController');

router.post('/register/student', registerStudents);
router.post('/register/teacher', registerTeacher);
router.post('/register/admin', registerAdmins);
router.post('/login', login);
router.put('/verify-email', verifyEmail);
router.post('/forget-password', forgetPassword);
router.put('/reset-password', resetPassword);
router.post('/does-email-exist', checkIfEmailAlreadyExist);

module.exports = router;