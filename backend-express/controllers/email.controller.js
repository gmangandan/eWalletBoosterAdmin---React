const nodemailer = require('nodemailer');
const {nodeMailerPass, nodeMailerUser} = require('../config/config');
const {User} = require('../models/index');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pug = require('pug');
const contactSubmit = pug.compileFile(process.cwd() + '/email-templates/contact.pug');
const forgotPassSubmit = pug.compileFile(process.cwd() + '/email-templates/forgot-pass.pug');
const moment = require('moment');

function sendContactForm (req, res, next) {

    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const date = moment().format('MMM Do YYYY');

    const mailOptions = {
        from: email, 
        to: nodeMailerUser, 
        subject: `We have received your support request`, 
        replyTo: email,
        html: contactSubmit({name: name, message: message, date: date, subject: subject})
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
        if (email.rejected.length > 0) throw {status: 404, message: 'Rejected'};         
        return res.status(201).send({success: true, msg: 'Enquiry submitted'});       
    })
    .catch(() => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    })
}

function forgotPass (req, res, next) {
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) throw {status: 404, msg: 'User not found.'};
        return Promise.all([user, crypto.randomBytes(20)])
        .then(([user, buffer]) => {
            const token = buffer.toString('hex');
            return Promise.all([user, token])
        })
        .then(([user, token]) => {
            return Promise.all([token, User.findByIdAndUpdate({_id: user._id}, {resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true })]) 
        })
        .then(([token, user]) => {
            const url = 'http://localhost:3001/reset-password?token=' + token;
            const name = user.firstName;        
            const subject = 'Password reset';
            const date = moment().format('MMM Do YYYY');

            const mailOptions = {                 
                to: user.email,
                from: nodeMailerUser, 
                subject: 'Resetting your password', 
                replyTo: nodeMailerUser,
                html: forgotPassSubmit({name: name, url: url, date: date, subject: subject})
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
                    return res.status(201).send({success: true, msg: 'Kindly check your email for further instructions'});
                }        
            })
            .catch(() => {
                return res.json({success: false, msg: 'server error'})
            })
        })
        .catch(() => {
            return res.json({success: false, msg: 'server error'})
        })

    })
    .catch(err => {
        if (err.status === 404) res.status(400).send({success: false, msg: err.msg});
        else return next({status: 500, message: 'server error'});
    })
}


function resetPass (req, res, next) {
    User.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    })
    .then(user => {
        if (!user) throw {status: 400, msg: 'Password reset token is invalid or has expired'};        
        bcrypt.hash(req.body.password, 10)
        .then(hash => { 
            User.findByIdAndUpdate({_id: user._id}, {$set: {password: hash, resetPasswordExpires: undefined, resetPasswordToken: undefined }})
            .then(() => {
                return res.status(201).send({success: true, msg: 'Password reset'});
            })
            .catch(() => {
                return res.json({success: false, msg: 'server error'})
            })
        })
        .catch(() => {
            return res.json({success: false, msg: 'server error'})
        })
    })
    .catch(err => {
        if (err.status === 400) res.status(400).send({success: false, msg: err.msg});
        else return next({status: 500, message: 'server error'});
    })
}







module.exports = {
    sendContactForm,
    forgotPass,
    resetPass
};



