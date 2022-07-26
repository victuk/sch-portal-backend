var express = require('express');
var router = express.Router();

const {
    deleteRecord,
    editRecord,
    searchByName,
    getStudentsResults,
    specificStudentDetail
} = require('../controllers/teacher/recordsController');

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

const { hasAccess } = require('../authenticationMiddlewares/accessControl');

router.use(checkLoggedIn);
router.use(isRestricted);
router.use(hasAccess.teacher);

router.post('/student-class-record', getStudentsResults);
router.get('/student/:id', specificStudentDetail);
router.put('/student-record/:id', editRecord);
router.delete('/student-record/:id', deleteRecord);

router.get('/student/:firstName/:surName', searchByName);

module.exports = router;