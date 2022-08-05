const { announcementSch } = require("../../models/announcementModel");
const { transporter } = require("../../utils/userUtil");
const { usersDB } = require("../../models/usersModel");

async function sendTheMail(options) {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log('An error occoured while trying to send the mail.');
  }
}

async function sendToParents(title, body, edited) {

  const details = await usersDB.find(
    { role: "student" },
    "parentName parentEmail"
  );

  for (let u of details) {
    var mailOptions = {
      from: "School <no-reply@school.com>",
      to: u.parentEmail,
      subject: `${title} ${edited ? '(Edited)' : ''} - School`,
      html: `
                      <div style="padding: 20px">
                          <h1 style="background-color: blue; white: color: white;">Message From School</h1>
                          <h2>${title} ${edited ? '(Edited)' : ''} </h2> <br><br>
                            Dear Mr./Mrs. ${u.parentName} <br>
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

    sendTheMail(mailOptions);
  }
}

async function sendToUsers(title, body, audienceType, edited) {
  if(audienceType == 'teacher') {

    const teachers = await usersDB.find({ role: "teacher" }, "firstName surName otherNames email gender");

    for (let u of teachers) {
      var mailOptions = {
        from: "School <no-reply@school.com>",
        to: u.email,
        subject: `${title} ${edited ? '(Edited)' : ''}  - School`,
        html: `
                        <div style="padding: 20px">
                            <h1 style="background-color: blue; white: color: white;">Message From School</h1>
                            <h2>${title} ${edited ? '(Edited)' : ''} </h2> <br><br>
                              Dear ${u.gender == 'male' ? 'Mr.' : 'Miss/Mrs.'} ${u.firstName} ${u.otherNames} ${u.surName},<br>
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
  
      sendTheMail(mailOptions);
    }

  } else if(audienceType == 'student') {

    const students = await usersDB.find({ role: "student" }, "firstName surName otherNames email gender");

    for (let u of students) {
      var mailOptions = {
        from: "School <no-reply@school.com>",
        to: u.email,
        subject: `${title} ${edited ? '(Edited)' : ''} - School`,
        html: `
                        <div style="padding: 20px">
                            <h1 style="background-color: blue; white: color: white;">Message From School</h1>
                            <h2>${title} ${edited ? '(Edited)' : ''} </h2> <br><br>
                              Dear ${u.gender == 'male' ? 'Master' : 'Miss'} ${u.firstName} ${u.otherNames} ${u.surName} <br>
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
  
      sendTheMail(mailOptions);
    }
  }
}

async function createAnnouncement(req, res) {
  const { title, announcement, audienceType } = req.body;

  const { id: postedBy } = req.decoded;

  const edited = false;

  const newAnn = await announcementSch.create({
    postedBy,
    announcementTitle: title,
    announcement: announcement,
    audienceType,
  });

  if (audienceType != "everyone") {
    const role = audienceType.slice(0, audienceType.length - 1);
    if(audienceType == 'teachers') {
      sendToUsers(title, announcement, role, edited);
    } else if (audienceType == 'students') {
      sendToUsers(title, announcement, role, edited);
    } else if((audienceType == 'parents')) {
      sendToParents(title, announcement, edited);
    }
  } else {
    sendToUsers(title, announcement, "teacher", edited);
    sendToUsers(title, announcement, "student", edited);
    sendToParents(title, announcement, edited);
  }

  res.json({
    message: "Announcemnt created.",
    newAnnouncement: newAnn
  });
}

async function getAllAnnouncements(req, res) {
  const allAnn = await announcementSch.find();
  res.json({
    allAnnouncement: allAnn,
  });
}

async function editSpecificAccouncement(req, res) {
  const {title, announcement, audienceType} = req.body;
  const {id: postID} = req.params;

  const edited = true;

  await announcementSch.findByIdAndUpdate(postID, {
    title,
    announcement,
  });

  if (audienceType != "everyone") {
    const role = audienceType.slice(0, audienceType.length - 1);
    if(audienceType == 'teachers') {
      sendToUsers(title, announcement, role, edited);
    } else if (audienceType == 'students') {
      sendToUsers(title, announcement, role, edited);
    } else if((audienceType == 'parents')) {
      sendToParents(title, announcement, edited);
    }
  } else {
    sendToUsers(title, announcement, "teacher", edited);
    sendToUsers(title, announcement, "student", edited);
    sendToParents(title, announcement, edited);
  }

  res.json({
    message: "Edit and resend successful."
  });
}

async function specificAnnouncement(req, res) {
  const { id } = req.params;

  const specificAnn = await announcementSch.findById(id);
  res.json({
    specificAnnouncement: specificAnn,
  });
}



async function deleteSpecificAnnouncement(req, res) {
  const { id } = req.params;

  try {
    await announcementSch.findByIdAndDelete(id);
    res.json({
      status: "Deleted",
    });
  } catch (error) {
    res.json({
      status: "Already deleted",
    });
  }
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  specificAnnouncement,
  deleteSpecificAnnouncement,
  editSpecificAccouncement
};
