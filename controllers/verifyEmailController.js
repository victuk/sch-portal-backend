const cryptojs = require("crypto-js");
require("dotenv").config();
const { usersDB } = require("../models/usersModel");
const cryptoKey = process.env.cryptoSecret;

async function verifyEmail(req, res) {
  const { vToken } = req.body;

  try {
    const decryptedEmail = cryptojs.AES.decrypt(vToken, cryptoKey);
    const email = cryptojs.enc.Utf8.stringify(decryptedEmail);
    console.log(email);
    if (!email) {
      res.status(400).json({
        message: "Invalid verification token.",
      });
      return;
    }
    await usersDB.findOneAndUpdate({ email: email }, { emailVerified: true });
    res.status(200).json({ message: "Email verified", email });
  } catch (error) {
    console.log("Couldn't verify email.");
    res.status(400).json({
      message: "Couldn't verify email.",
    });
  }
}

module.exports = {
  verifyEmail,
};
