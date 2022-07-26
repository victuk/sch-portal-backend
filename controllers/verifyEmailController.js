const cryptojs = require('crypto-js');
require('dotenv').config();
const { usersDB } = require('../models/usersModel');
const cryptoKey = process.env.cryptoSecret;

async function verifyEmail(req, res) {
    const {vToken} = req.body;

    const decryptedEmail = cryptojs.AES.decrypt(vToken, cryptoKey);
    const email = cryptojs.enc.Utf8.stringify(decryptedEmail);
    console.log(email);

    await usersDB.findOneAndUpdate({email: email}, {emailVerified: true});
    res.status(200).json({message: 'Email verified'});
}

module.exports = {
    verifyEmail
};
