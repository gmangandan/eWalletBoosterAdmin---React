var apassport = require('passport');
const { secret } = require('../config/config');
require('../config/admin_passport')(apassport);
const { getToken } = require('../utils/api.helpers');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Admin = require('../admin_models/Admin');
const nodemailer = require('nodemailer');
const { nodeMailerPass, nodeMailerUser } = require('../config/config');
const pug = require('pug');
const forgotPassSubmit = pug.compileFile(process.cwd() + '/admin-email-templates/forgot-pass.pug');
const moment = require('moment');





function createNewAdmin(req, res, next) {
    console.log('req.body.email', req.body.email);
    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName) {
        return res.json({ success: false, msg: 'Please enter username and password.' });
    } else {
        const newAdmin = new Admin({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            mobileNumber: req.body.mobileNumber
        });
        // save the user
        newAdmin.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: err });
            }
            Admin.findOne({
                email: req.body.email
            },
                { password: 0 },
                function (err, user) {
                    if (err) return next(err);
                    else {
                        const token = jwt.sign(user.toJSON(), secret);
                        return res.json({ success: true, msg: 'Created new user', token: 'JWT ' + token, data: user });
                    }
                });
        });
    }
}


function adminLogin(req, res, next) {

    const { body } = req;
    const {
        username,
        password
    } = body;
    if (!username) return res.send({ success: false, message: 'Please enter your username' });
    if (!password)  return res.send({ success: false, message: 'Please enter your password' });
    Admin.findOne({
        username: username
    },
        function (err, user) {
            if (err) return next(err);
            else if (!user) {
                return res.status(401).send({ success: false, msg: ' Invalid username' });
            } else {
                user.comparePassword(password, function (err, isMatch) {
                    if (isMatch && !err) {
                        const token = jwt.sign(user.toJSON(), secret);
                        return res.json({ success: true, token: 'JWT ' + token, data: user });
                    } else {
                        return res.status(401).send({ success: false, msg: ' Invalid password' });
                    }
                });
            }
        })
}

function forgotPass(req, res, next) {
    if (!req.body.username) {
        return res.send({ success: false, message: 'Please enter your username' });
    }
    Admin.findOne({ username: req.body.username })
        .then(user => {
            if (!user) throw { status: 404, msg: 'Account not found.' };
            return Promise.all([user, crypto.randomBytes(20)])
                .then(([user, buffer]) => {
                    const token = buffer.toString('hex');
                    return Promise.all([user, token])
                })
                .then(([user, token]) => {
                    return Promise.all([token, Admin.findByIdAndUpdate({ _id: user._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true })])
                })
                .then(([token, user]) => {
                    const url = 'http://localhost:3002/reset-password?token=' + token;
                    const name = user.firstName;
                    const subject = 'Password reset';
                    const date = moment().format('MMM Do YYYY');
                    const mailOptions = {
                        to: user.email,
                        from: nodeMailerUser,
                        subject: 'Resetting your password',
                        replyTo: nodeMailerUser,
                        html: forgotPassSubmit({ name: name, url: url, date: date, subject: subject })
                    }
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: nodeMailerUser,
                            pass: nodeMailerPass
                        }
                    })
                    transporter.sendMail(mailOptions)
                        .then((email) => {
                            if (email.rejected.length === 0) {
                                return res.status(201).send({ success: true, msg: 'Kindly check your email for further instructions' });
                            }
                        })
                        .catch(err => {
                            return res.json({ success: false, msg: 'server error' })
                        })
                })
                .catch(() => {
                    return res.json({ success: false, msg: 'server error' })
                })
        })
        .catch(err => {
            if (err.status === 404) res.status(400).send({ success: false, msg: err.msg });
            else return next({ status: 500, message: 'server error' });
        })
}

function resetPass(req, res, next) {
    Admin.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }).then(user => {
            if (!user) throw { status: 400, msg: 'Password reset token is invalid or has expired' };
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    Admin.findByIdAndUpdate({ _id: user._id }, { $set: { password: hash, resetPasswordExpires: undefined, resetPasswordToken: undefined } })
                        .then(() => {
                            return res.status(201).send({ success: true, msg: 'Your password was reset successfully. Please login!' });
                        })
                        .catch(() => {
                            return res.json({ success: false, msg: 'server error' })
                        })
                })
                .catch(() => {
                    return res.json({ success: false, msg: 'server error' })
                })
        })
        .catch(err => {
            if (err.status === 400) res.status(400).send({ success: false, msg: err.msg });
            else return next({ status: 500, message: 'server error' });
        })
}


function checkAuthentication(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        return Admin.findOne({ _id: req.user._id }, { password: 0 })
            .then(accounts => {
                if (accounts.length === 0) throw { status: 404, msg: 'Unauthorised' };
                return res.status(200).send(accounts);
            })
            .catch(err => {
                if (err.status === 404) res.status(404).send({ success: false, msg: err.msg });
                else return next({ status: 500, message: 'server error' });
            });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}


module.exports = {
    createNewAdmin,
    adminLogin,
    forgotPass,
    resetPass,
    checkAuthentication
};
