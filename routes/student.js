var express = require('express');
var router = express.Router();

// router.post('/register');
router.put('/verify-email');
router.post('/login');
router.get('/');

router.get('/results');
router.get('/result/:id');

router.get('/parents-request');
router.post('/accept-parent');

module.exports = router;
