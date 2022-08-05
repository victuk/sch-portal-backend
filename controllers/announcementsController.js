const { announcementSch } = require('../models/announcementModel');

async function getGeneralAnnouncement(req, res) {
    const allGeneralAnnouncements = await announcementSch.find({audienceType: 'everyone'});

    res.json({
        announcements: allGeneralAnnouncements
    });
}

async function specificAudienceAnnouncement(req, res) {
    const { role } = req.decoded;

    const userRole = role + 's';

    const ann = await announcementSch.find({audienceType: userRole});

    res.json({
        announcements: ann
    });
}

module.exports = {
    getGeneralAnnouncement,
    specificAudienceAnnouncement
};
