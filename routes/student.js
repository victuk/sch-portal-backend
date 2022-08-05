var express = require('express');
var router = express.Router();

const {
    getStudentEmail,
    getStudentProfile
} = require('../controllers/student/studentController');

const { getResult } = require('../controllers/student/resultsController');

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

router.use(checkLoggedIn);
router.use(isRestricted);

router.get('/profile', getStudentProfile);
router.get('/email', getStudentEmail);

// router.post('/results');
router.post('/result', getResult);
// router.get('/result/:id');

// router.get('/parents-request');
// router.post('/accept-parent');

module.exports = router;
