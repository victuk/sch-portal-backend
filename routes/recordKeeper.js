var express = require('express');
var router = express.Router();

const { uploadRecords, loadTeachers, viewRecordsByClass } = require("../controllers/recordkeeper/recordsController");
const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

router.use(checkLoggedIn);
router.use(isRestricted);

router.post('/upload', uploadRecords);
router.get('/resultsbyclass/:choosenClass', viewRecordsByClass);
router.get('/loadteachers', loadTeachers);

module.exports = router;