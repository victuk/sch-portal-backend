const { announcementSch } = require("../../models/announcementModel");
const { transporter } = require('../../utils/userUtil');
const { usersDB } = require('../../models/usersModel');

async function createAnnouncement(req, res) {
  const { announcement, audienceType } = req.body;

  const { id: postedBy } = req.params;

  const newAnn = await announcementSch.create({
    postedBy,
    announcement,
    audienceType
  });
  

  if(audienceType == 'parent') {
    const users = usersDB.find({role: 'student'}, 'parentName parentEmail');
    for(let u of users) {
        
        var mailOptions = {
            from: "School <no-reply@school.com>",
            to: u.parentEmail,
            subject: `${title} - School`,
            html: `
                          <div style="padding: 20px">
                              <h1 style="background-color: blue; white: color: white;">Message From School</h1>
                              <h2>${title}</h2> <br><br>
                                Dear ${u.parentName} <br>
                                <div>
                                ${body}
                                </div>
                              <style>
                                    div, a {
                                      padding: 20px 10px;
                                    }
                              </style>
                          </div>
                          `,
          };
      
          transporter.sendMail(mailOptions);
    }
  } else {
    let g = 'male' ? 'Mr.' : 'Miss./Mrs.';
    const users = usersDB.find({role: audienceType}, 'firstName surName otherNames email gender');
    for(let u of users) {
        
        var mailOptions = {
            from: "School <no-reply@school.com>",
            to: u.email,
            subject: `${title} - School`,
            html: `
                          <div style="padding: 20px">
                              <h1 style="background-color: blue; white: color: white;">Message From School</h1>
                              <h2>${title}</h2> <br><br>
                                Dear ${g} ${u.surName}, ${u.firstName} ${u.otherNames}, <br>
                                <div>
                                ${body}
                                </div>
                              <style>
                                    div, a {
                                      padding: 20px 10px;
                                    }
                              </style>
                          </div>
                          `,
          };
      
          transporter.sendMail(mailOptions);
    }
}

  res.json({
    message: "Announcemnt created.",
    newAnnouncement: newAnn,
  });
}

async function getAllAnnouncements(req, res) {
    const allAnn = await announcementSch.find();
    res.json({
        allAnnouncement: allAnn
      });
}

async function specificAnnouncement(req, res) {
    const { id } = req.params;

    const specificAnn = await announcementSch.findById(id);
    res.json({
        specificAnnouncement: specificAnn
      });
}

async function deleteSpecificAnnouncement(req, res) {
    const { id } = req.params;

    try {
        await announcementSch.findByIdAndDelete(id);
    res.json({
        status: 'Deleted' 
      });
    } catch (error) {
        res.json({
            status: 'Already deleted' 
          });
    }
}

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    specificAnnouncement,
    deleteSpecificAnnouncement
};
