const cryptojs = require('crypto-js');
require('dotenv').config();
const cryptoKey = process.env.cryptoSecret

async function verifyEmail(req, res) {
    const {vToken} = req.body;

    const decryptedEmail = cryptojs.AES.decrypt(vToken, cryptoKey);

    await usersDB.findOneAndUpdate({email: decryptedEmail}, {emailVerified: true});
    res.status(200).json({message: 'Email verified'});
}