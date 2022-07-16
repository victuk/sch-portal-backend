var express = require('express');
var router = express.Router();

router.get('/payment-proofs');
router.get('/payment-proof/:id');
router.post('/verify-payments');

module.exports = router;
