var express = require('express');
var router = express.Router();

const { uploadRecords } = require("../controllers/recordkeeper/recordsController");

router.post('/upload', uploadRecords);
router.get('/results', uploadRecords);

module.exports = router;