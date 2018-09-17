var  passport = require('passport');
const {secret1} = require('../config/config');
require('../config/passport')(passport);
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const {nodeMailerPass, nodeMailerUser} = require('../config/config');
const pug = require('pug');
const contactSubmit = pug.compileFile(process.cwd() + '/email-templates/contact.pug');
const moment = require('moment');
var secret = 'XX4478HDNDnsndHHGK238ma';

// POST /auth/register | adds a new User to database
function createNewUser (req, res, next) {
    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {        
        return res.json({success: false, msg: 'Please enter username and password.'});
      } else {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            mobileNumber: req.body.mobileNumber
        });       
        // save the user
        newUser.save(function (err) {
            if (err) {       
                   
                return res.json({success: false, msg: 'Email address already exists'});
            }           
            User.findOne({
                email: req.body.email                
            }, 
            { password: 0 },
            function (err, user) {
                if (err) return next(err);
                else {
                    const token = jwt.sign(user.toJSON(), secret);
                    return res.json({success: true, msg: 'Created new user', token: 'JWT ' + token, data: user});
                }
            });
        });        
    }
}

// POST /auth/login | authenticates user details to create login
function userLogin (req, res, next) {
    User.findOne({
        email: req.body.email        
    },
    function (err, user) {
        if (err) return next(err);
        else if (!user) {
            return res.status(401).send({success: false, msg: 'User not found'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    const token = jwt.sign(user.toJSON(), secret);
                    // return the info including token as JSON
                    return res.json({success: true, token: 'JWT ' + token, data: user});
                } else {
                    return res.status(401).send({success: false, msg: 'Authentication failed. Incorrect password'});
                }
            });
        }
    })
}



module.exports = {
    createNewUser,
    userLogin
};
