const { usersDB } = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwtKey = process.env.secretkey;

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const u = await usersDB.findOne(
      { email },
      "email emailVerified suspended role password admitted"
    );
    if (!u) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const passwordsMatch = bcrypt.compareSync(password, u.password);
      if (passwordsMatch) {
        let payload;
        if (u.role == "student" && !u.admitted) {
          res.json({
            message: "You've not been given admission yet.",
          });
        } else {
          if (!u.emailVerified) {
            res.json({
              message: "You've not Verified your email.",
            });
          } else if (u.suspended) {
            res.json({
              message: "You have hereby been suspended by the admin.",
            });
          } else {
            payload = { id: u._id, email: u.email, role: u.role };

            const accesstoken = jwt.sign(payload, jwtKey);
            res.status(200).json({
              message: "Login Successful",
              accesstoken,
              userRole: u.role,
            });
          }
        }
      } else {
        res.status(400).json({
          message: "Invalid login details",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occured.",
    });
  }
}

module.exports = {
  login,
};
