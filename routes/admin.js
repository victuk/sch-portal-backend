var express = require('express');
var router = express.Router();

router.post('/register');
router.put('/verify-email');
router.post('/login');
router.get('/');

router.get('/students');
router.get('/student/:id');
router.put('/student/:id');

router.post('/email/parents');
router.post('/email/parent/:id');
router.post('/email/parents-array');

router.get('/teachers-request');
router.post('/accept-request');

router.delete('/student-parent-link');

module.exports = router;
