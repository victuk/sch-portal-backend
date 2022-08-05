var express = require('express');
var router = express.Router();
const { checkLoggedIn } = require('../authenticationMiddlewares/loginAuth');
const { isRestricted } = require('../authenticationMiddlewares/isRestricted');
const {
    getGeneralAnnouncement,
    specificAudienceAnnouncement
} = require('../controllers/announcementsController');

router.get('/general', getGeneralAnnouncement);

router.use(checkLoggedIn);
router.use(isRestricted);

router.get('/specific-audience', specificAudienceAnnouncement);


module.exports = router;
