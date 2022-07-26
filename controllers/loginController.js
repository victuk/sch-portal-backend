const { usersDB } = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const { theroles } = require('../authenticationMiddlewares/accessControl');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwtKey = process.env.secretkey;

async function login(req, res) {
    try {
        const {email, password} = req.body;

    const u = await usersDB.findOne({email}, 'email role password');

    if(!u) {
        res.status(404).json({
            message: 'User not found'
        });
    } else {
        const passwordsMatch = bcrypt.compareSync(password, u.password);
        if(passwordsMatch) {
            const payload = {id: u._id, email: u.email, role: u.role};
            const accesstoken = jwt.sign(payload, jwtKey);
            res.status(200).json({
                message: 'Login Successful',
                accesstoken,
                userRole: u.role
            });
        } else {
            res.status(400).json({
                message: 'Invalid login details'
            });
        }
    }
    } catch (error) {
        res.status(400).json({
            message: 'An error occured.'
        });
    }
    
}

module.exports = {
    login
};
