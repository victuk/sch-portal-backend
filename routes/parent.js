var express = require('express');
var router = express.Router();

router.post('/register');
router.post('/login');
router.get('/');

router.get('/payment-proofs');
router.get('payment-proof/:id');
router.post('verify-payments');

router.get('/children');
router.get('/child/:id');
router.post('/send-request');

router.get('/children-list');
router.get('/result/:id');

router.get('/teacher/:id');

module.exports = router;