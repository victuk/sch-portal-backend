const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId, ref: 'Users',
        required: true
    },
    announcment: String,
    audienceType: {
        enum: ['everyone', 'students', 'teachers'],
    }
},
{ timestamps: true });

const announcementSch = mongoose.model('announcements', announcementSchema);

module.exports = { announcementSch };