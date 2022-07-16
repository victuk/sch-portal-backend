var express = require('express');
var router = express.Router();

router.post('/register');
router.post('/login');
router.get('/');

router.get('/student/:id');
router.post('/student-record/:id');
router.put('/student-record/:id');
router.delete('/student-record/:id');

router.get('/students-parent/:id');
router.get('/parents');
router.get('/parents/:id');
router.post('/complaint/:id');

module.exports = router;