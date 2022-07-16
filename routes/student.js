var express = require('express');
var router = express.Router();

router.post('/register');
router.post('/login');
router.get('/');

router.get('/payment-proofs');
router.get('payment-proof/:id');
router.post('/verify-payment');

router.get('/results');
router.get('/result/:id');

router.get('/parents-request');
router.post('/accept-parent');

module.exports = router;
