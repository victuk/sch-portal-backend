const { transporter } = require("../utils/userUtil");
const cryptoKey = process.env.cryptoSecret;
const cryptojs = require("crypto-js");
const bcrypt = require('bcryptjs');

function forgetPassword(req, res) {
  const { email } = req.body;

  const resetPasswordToken = cryptojs.AES.encrypt(email, cryptoKey);

  var mailOptions = {
    from: "School <no-reply@school.com>",
    to: email,
    subject: `School - Email Verification`,
    html: `
        <div style="padding: 20px">
            <h1 style="background-color: blue; white: color: white;">Click this link to verify your email</h1>
            Link to verify: ${req.headers.host}/reset-password?resetpasswordtoken=${resetPasswordToken}

            <div>
            <a href="${req.headers.host}/reset-password?resetpasswordtoken=${resetPasswordToken}">Verify</a>
            </div>
            <style>
                div, a {
                    padding: 20px 10px;
                }
            </style>
        </div>
        `
  };
  transporter.sendMail(mailOptions);

  res.status(200).json({
    message: "Password reset link sent",
  });
}

async function resetPassword(req, res) {
    try {
        const {
            resetPasswordToken,
            newPassword
        } = req.body;
    
        const decryptedEmail = cryptojs.AES.decrypt(resetPasswordToken, cryptoKey);
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
    
        await usersDB.findOneAndUpdate({email: decryptedEmail}, {password: hashedPassword});
        res.status(200).json({message: 'Password Updated.'});
    } catch (error) {
        res.status(400).json({
            message: 'An error occured.'
        });
    }
    

}

module.exports = {
  forgetPassword,
  resetPassword,
};
