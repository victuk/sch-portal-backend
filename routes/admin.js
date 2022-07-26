var express = require('express');
var router = express.Router();
const {
    changeDetails,
    searchByEmail,
    searchByName,
    showStudents,
    specificStudent
} = require('../controllers/admin/studentsController');

const {
    emailEveryParent,
    emailEveryTeacher,
    emailSpecificPeople
} = require('../controllers/admin/emailController');

const {
    createAnnouncement,
    deleteSpecificAnnouncement,
    getAllAnnouncements,
    specificAnnouncement
} = require('../controllers/admin/announcementController');

const {
    // addTeacher,
    searchTeacherByEmail,
    searchTeacherByName,
    specificTeacher
} = require('../controllers/admin/teacherController');

const { hasAccess } = require('../authenticationMiddlewares/accessControl');

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');


router.use(checkLoggedIn);
router.use(isRestricted);

router.get('/students', showStudents);
router.get('/student/:id', specificStudent);
router.put('/student/:id', changeDetails);
router.get('/search-student/:firstName/:surName', searchByName);
router.get('/search-by-email/:email', searchByEmail);

router.get('/search-teacher/:firstName/:surName', searchTeacherByName);
router.get('/search-teacher-by-email/:email', searchTeacherByEmail);
router.get('/teacher/:id', specificTeacher);

// To test
router.post('/email/parents', emailEveryParent);
router.post('/email/teachers', emailEveryTeacher);
router.post('/email/one-person', emailSpecificPeople);
// router.post('/email/parent/:id');
// router.post('/email/parents-array');

// router.get('/teachers-request');
// router.post('/accept-request');

// School Admin Announcements
router.post('/announcement', hasAccess.admin, createAnnouncement);
router.get('/announcements', hasAccess.admin, getAllAnnouncements);
router.get('/announcement/:id', hasAccess.admin, specificAnnouncement);
router.delete('/announcement/:id', hasAccess.admin, deleteSpecificAnnouncement);

module.exports = router;
