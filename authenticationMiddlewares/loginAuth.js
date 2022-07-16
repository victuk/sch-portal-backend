const jwt = require('jsonwebtoken');
var { registerAdmin } = require('../models/schoolElectionsModel/registerModel');
require('dotenv').config();
let secret = process.env.secretkey;

function checkLoginSchoolElection(req, res, next){
    const token = req.headers.accesstoken;
    
    if(token){
        const tok = token.split(' ');
        const authType = tok[0];
        
        if(authType.toLowerCase() == 'bearer') {
            const tokenItself = tok[1];

            jwt.verify(tokenItself, secret, function(err, decoded){
                if(err){
                    console.log(err);
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    registerAdmin.findById(decoded.id, 'email emailVerified suspended role', (err, user) => {
                        
                        if (err) {
                            return console.log(err);
                        }
                        
                        if (user) {
                            req.decodedUserDetails = user;
                            next()
                            
                        } else {
                            res.json({status: 'User does not exist'})
                        }
    
                    });
                }
            });

        }
    } else {
        res.status(400).json({status: 'notLoggedIn', message:'You will need to login'});
    }
}

module.exports = {
    checkLoginSchoolElection
};
