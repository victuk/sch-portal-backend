const { usersDB } = require('../../models/usersModel');
const bcrypt = require('bcryptjs');
const { transporter } = require('../../utils/userUtil');

async function register(req, res) {
    const {
        firstName,
        surName,
        otherNames,
        gender,
        passportPicture,
        passportPublicId,
        email,
        password
    } = req.body;

    if(firstName &&
        surName &&
        otherNames &&
        gender &&
        passportPicture &&
        passportPublicId &&
        email &&
        password) {
            req.body.role = 'admin';
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            req.body.password = hashedPassword;
            req.body.emailVerified = false;
            const vToken = cryptojs.AES.encrypt(email, cryptoKey);

            const newUser = new usersDB(req.body);
            await newUser.save();

            var mailOptions = {
                from: "School <no-reply@school.com>",
                to: votersList[i].email,
                subject: `School - Email Verification`,
                html: `
                        <div style="padding: 20px">
                            <h1 style="background-color: blue; white: color: white;">Click here to verify your email</h1>
                            Link to verify: ${req.headers.host}/verify-email?vtoken=${vToken}
        
                              <div>
                              <a href="${req.headers.host}/verify-email?vtoken=${vToken}">Verify</a>
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

            res.status(201).json({
                message: 'Admin created.',
                vToken
            });
        } else {
            res.status(400).json({
                message: 'Incomplete user details.'
            });
        }
}



