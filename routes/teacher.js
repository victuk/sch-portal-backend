var express = require('express');
var router = express.Router();

const {
    deleteRecord,
    editRecord,
    searchByName,
    getStudentsResults,
    specificStudentDetail
} = require('../controllers/teacher/recordsController');

const {
    getTeacherProfile
} = require('../controllers/teacher/profileController');

const {
    getStudentsPosition,
    editPosition
} = require("../controllers/teacher/studentPositionController");

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

const { hasAccess } = require('../authenticationMiddlewares/accessControl');

router.use(checkLoggedIn);
router.use(isRestricted);
router.use(hasAccess.teacher);

router.get('/profile', getTeacherProfile);

router.post('/student-class-record', getStudentsResults);
router.get('/student/:id', specificStudentDetail);
router.put('/student-record/:id', editRecord);
router.delete('/student-record/:id', deleteRecord);

router.get('/student/:firstName/:surName', searchByName);

router.get("/student-positions", getStudentsPosition);
router.post("/edit-student-position", editPosition);

module.exports = router;