var express = require('express');
var router = express.Router();

const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');

router.use(checkLoggedIn);
router.use(isRestricted);

// router.post('/results');
router.post('/result');
// router.get('/result/:id');

// router.get('/parents-request');
router.post('/accept-parent');

module.exports = router;
