const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId, ref: 'users',
        required: true
    },
    announcementTitle: String,
    announcement: String,
    audienceType: {
        type: String,
        enum: ['everyone', 'students', 'teachers', 'parents'],
    }
},
{ timestamps: true });

const announcementSch = mongoose.model('announcements', announcementSchema);

module.exports = { announcementSch };