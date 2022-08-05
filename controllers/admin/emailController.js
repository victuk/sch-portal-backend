const { usersDB } = require('../../models/usersModel');
const { transporter } = require('../../utils/userUtil');

async function sendTheMail(options) {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log('An error occoured while trying to send the mail.');
  }
}

async function emailEveryTeacher(req, res) {
    const {title, body} = req.body;
    const users = await usersDB.find({role: 'teacher'}, 'firstName surName otherNames email gender');

    
    for(let u of users) {
        let g = 'male' ? 'Mr.' : 'Miss./Mrs.';

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
      
          sendTheMail(mailOptions);
    }

    res.status(200).json({
        message: 'Emails sent to teachers successfully'
    });

}

async function emailEveryParent(req, res) {
    const { title, body } = req.body;

    const users = await usersDB.find({role: 'student'}, 'parentName parentEmail');


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
      
          sendTheMail(mailOptions);
    }

    res.status(200).json({
        message: 'Emails sent to parents successfully'
    });
}

async function emailSpecificPeople(req, res) {
    const { emailAddress, person, title, body } = req.body;

    var mailOptions = {
        from: "School <no-reply@school.com>",
        to: emailAddress,
        subject: `${title} - School`,
        html: `
                      <div style="padding: 20px">
                          <h1 style="background-color: blue; white: color: white;">Message From School</h1>
                          <h2>${title}</h2> <br><br>
                            Dear ${person} <br>
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

      res.status(200).json({
        message: `Emails sent to ${person} successfully`
    });
}

module.exports = {
    emailEveryTeacher,
    emailEveryParent,
    emailSpecificPeople
};
