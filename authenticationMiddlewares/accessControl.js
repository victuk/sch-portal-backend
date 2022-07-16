const User = require('../models/register');
// const Blog = require('../models/Blogs');

const theroles = {
    student: "student",
    parent: "parent",
    admin: "admin",
    teacher: "teacher"
}

// function hasAccess(req, res, next){

//         Blog.findById(req.params.id, function(error, blog) {
//             if(error) {console.log(error)}

//             if(req.decoded.id == blog.userID) {
//                 next();
//             } else {
//                 User.findById(req.decoded.id, function(error, user) {
//                     if(error) {res.send('Error = ' + error)}
//                     if(user.role == theroles.admin) {
//                         next();
//                     } else {
//                         res.send('You are forbidden from taking this action');
//                     }
//                 })
//             }
//         })


// }


const hasAccess = {
    everyone (req, res, next) {
        next();
    },
    schoolAdmins (req, res, next) {
        if (req.decoded.role == theroles.schoolAdmin) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized. This route is only for schoadmins."
                });
            }
    },
    voters (req, res, next) {
        if (req.decoded.role == theroles.voter) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized. This route is only for voters."
                });
            }
    },
    votersAndSchoolAdmins (req, res, next) {
        if (req.decoded.role == theroles.voter || req.decoded.role == theroles.schoolAdmin) {
                next();
                
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized. This route is only for voters and school admins."
                });
            }
    },
    swiftVoteAdmin (req, res, next) {
        if (req.decoded.role == theroles.admin) {
                next();
            } else {
                res.json({
                    success: false,
                    message: "Not Authorized. This route is only for swift vote admins."
                });
            }
    }
}

module.exports = { hasAccess, theroles };

