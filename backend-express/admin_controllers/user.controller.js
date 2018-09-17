var apassport = require('passport');
require('../config/admin_passport')(apassport);
const { User, Application } = require('../models/index');
const { getToken } = require('../utils/api.helpers');
const nodemailer = require('nodemailer');
const pug = require('pug');
const moment = require('moment');
const applicationConfirm = pug.compileFile(process.cwd() + '/admin-email-templates/application-confirm.pug');
const applicationDeclined = pug.compileFile(process.cwd() + '/admin-email-templates/application-declined.pug');
function getuserAccount(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        let pageLimit = parseInt(req.query.pageLimit);
        let skippage = pageLimit * (req.query.page - 1);
        var query = { isDeleted: false };
        if (req.query.searchKey && req.query.searchBy) {
            query[req.query.searchBy] = new RegExp(req.query.searchKey, 'i');
        }
        User.find(query, { password: 0 }).skip(skippage).limit(pageLimit)
            .then(results => {
                if (results.length === 0) return res.status(200).send({ success: false, 'results': [], totalCount: 0 });
                User.count(query).then(userCounts => {
                    return res.status(200).send({ success: true, 'results': results, totalCount: userCounts });
                });
            }).catch((err) => {
                return res.json({ success: false, msg: 'Server error' });
            });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function getUserRowById(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        User.findById(req.query._id, { password: 0 }).then(userRow => {
            if (userRow.length === 0) return res.status(200).send({ success: false });
            return res.status(200).send({ success: true, 'results': userRow });
        }).catch(() => {
            return res.json({ success: false, msg: 'Server error' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function createuserAccount(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { firstName, lastName, username, email, password, cpassword, mobileNumber, countryCode, skrillEmail, netellerEmail, paypalEmail, accountName, sortCode, accountNo } = body.userData;
        if (!firstName) return res.send({ success: false, message: 'Please enter your name.' });
        if (!username) return res.send({ success: false, message: 'Please enter your username.' });
        if (!email) return res.send({ success: false, message: 'Please enter your email address.' });
        if (!password) return res.send({ success: false, message: 'Please enter your password.' });
        if (!cpassword) return res.send({ success: false, message: 'Please confirm your password.' });
        User.find({ username: username, isDeleted: false }).then(existUser => {
            if (existUser.length > 0) return res.status(400).send({ success: false, msg: 'Username already exists.' });
            User.find({ email: email, isDeleted: false }).then(existsEmail => {
                if (existsEmail.length > 0) return res.status(400).send({ success: false, msg: 'Email address already exists.' });
                const newUser = new User();
                newUser.firstName = firstName;
                newUser.lastName = lastName;
                newUser.username = username;
                newUser.email = email;
                newUser.mobileNumber = mobileNumber;
                newUser.countryCode = countryCode;
                newUser.countryCode = countryCode;
                newUser.skrillEmail = skrillEmail;
                newUser.netellerEmail = netellerEmail;
                newUser.paypalEmail = paypalEmail;
                newUser.accountName = accountName;
                newUser.sortCode = sortCode;
                newUser.accountNo = accountNo;
                newUser.password = newUser.generateHash(password);
                newUser.save((err, doc) => {
                    if (err) {
                        return res.status(400).send({ success: true, msg: 'Server error!' });
                    }
                    return res.status(201).send({ success: true, msg: 'Account created successfully!' });
                });
            });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function updateUserAccount(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { _id, firstName, lastName, username, email, password, cpassword, mobileNumber, countryCode, skrillEmail, netellerEmail, paypalEmail, accountName, sortCode, accountNo, } = body.userData;
        if (!firstName) return res.send({ success: false, message: 'Please enter your name.' });
        if (!username) return res.send({ success: false, message: 'Please enter your username.' });
        if (!email) return res.send({ success: false, message: 'Please enter your email address.' });
        if (req.body.changePass) {
            if (!password) return res.send({ success: false, message: 'Please enter your password.' });
            if (!cpassword) return res.send({ success: false, message: 'Please confirm your password.' });
        }
        User.findById({
            _id
        }).then(user => {
            if (!user) throw { status: 400, msg: 'Invalid User.' };
            User.find({ username: username, isDeleted: false, _id: { $ne: _id } }).then(existUser => {
                if (existUser.length > 0) return res.status(400).send({ success: false, msg: 'Username already exists.' });
                User.find({ email: email, isDeleted: false, _id: { $ne: _id } }).then(existEmail => {
                    if (existEmail.length > 0) return res.status(400).send({ success: false, msg: 'Email address already exists.' });
                    let updateData = {
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        email: email,
                        mobileNumber: mobileNumber,
                        countryCode: countryCode,
                        skrillEmail: skrillEmail,
                        netellerEmail: netellerEmail,
                        paypalEmail: paypalEmail,
                        accountName: accountName,
                        sortCode: sortCode,
                        accountNo: accountNo,
                    };
                    if (req.body.changePass) updateData.password = user.generateHash(password);
                    User.findByIdAndUpdate({ _id: user._id }, { $set: updateData })
                        .then(() => {
                            return res.status(201).send({ success: true, msg: 'User updated successfully!' });
                        }).catch(() => {
                            return res.json({ success: false, msg: 'Server error' });
                        });
                }).catch(() => {
                    return res.json({ success: false, msg: 'Server error' });
                });
            }).catch(() => {
                return res.json({ success: false, msg: 'Server error' });
            });
        }).catch(err => {
            if (err.status === 400) res.status(400).send({ success: false, msg: err.msg });
            else return next({ status: 500, message: 'Server error' });
        })
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function deleteUserAccount(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { _id } = body;
        if (!_id) return res.send({ success: false, message: 'ID missing.' });
        User.findById({ _id }).then(user => {
            if (!user) throw { status: 400, msg: 'Invalid User.' };
            updateData = { isDeleted: true };
            User.findByIdAndUpdate({ _id: user._id }, { $set: updateData })
                .then(() => {
                    return res.status(201).send({ success: true, msg: 'User deleted successfully!' });
                }).catch(() => {
                    return res.json({ success: false, msg: 'Server error' });
                });
        }).catch(() => {
            return res.json({ success: false, msg: 'Server error' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}



function getuserApplications(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        let pageLimit = parseInt(req.query.pageLimit);
        let skippage = pageLimit * (req.query.page - 1);

        var query = {};
        if (req.query.searchKey && req.query.searchBy) {
            query[req.query.searchBy] = new RegExp(req.query.searchKey, 'i');
        }
        Application.find(query, { password: 0 }).skip(skippage).limit(pageLimit)
            .then(results => {
                if (results.length === 0) return res.status(200).send({ success: false, 'results': [], totalCount: 0 });
                Application.count(query).then(totalCount => {
                    return res.status(200).send({ success: true, 'results': results, totalCount: totalCount });
                });
            }).catch((err) => {
                return res.json({ success: false, msg: 'Server error' });
            });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function updateuserApplications(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { action, _id } = body;
        if (!_id) return res.send({ success: false, message: 'ID missing.' });
        if (!action) return res.send({ success: false, message: 'Action missing.' });
        let message = templateName = subJoinText = '';
        let updateData = {};
        if (action === 'approve') {
            message = 'User application approved successfully';
            templateName = applicationConfirm;
            subJoinText = 'approved';
            updateData.status = 'Approved';
        } else if (action === 'declined') {
            message = 'User application declined successfully';
            subJoinText = 'declined';
            templateName = applicationDeclined;
            updateData.status = 'Declined';
        } else {
            message = 'User application deleted successfully';

        }
        Application.findById({ _id }).then(appl => {
            if (!appl) throw { status: 400, msg: 'Invalid application.' };
            if (action === 'approve' || action === 'declined') {
                Application.findByIdAndUpdate({ _id: appl._id }, { $set: updateData })
                    .then(() => {
                        const name = appl.firstName + ' ' + appl.lastName;
                        const email = appl.email;
                        const brand = appl.brand;
                        const accountId = appl.accountId;
                        const paymentEmail = appl.accountEmailAddress;
                        const date = moment().format('MMM Do YYYY');
                        const mailOptions = {
                            from: nodeMailerUser,
                            to: email,
                            subject: `Your application for ${brand} account ${accountId} has been ${subJoinText}`,
                            replyTo: nodeMailerUser,
                        }
                        if (action == 'approve') {
                            mailOptions.html = applicationConfirm({ name: name, brand: brand, accountId: accountId, paymentEmail: paymentEmail, date: date });
                        } else {
                            mailOptions.html = applicationDeclined({ name: name, brand: brand, accountId: accountId, paymentEmail: paymentEmail, date: date });
                        }
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: nodeMailerUser,
                                pass: nodeMailerPass
                            }
                        })
                        transporter.sendMail(mailOptions).then((email) => {
                            if (email.rejected.length === 0) {
                                return res.status(201).send({ success: true, msg: message });
                            }
                        }).catch(err => {
                            return res.json({ success: false, msg: 'server error' })
                        })
                    }).catch((err) => {
                        return res.json({ success: false, msg: 'Server error' });
                    });
            } else {
                Application.findByIdAndRemove(appl._id).then(() => {
                    return res.status(201).send({ success: true, msg: message });
                }).catch((err) => {
                    return res.json({ success: false, msg: 'Server error' });
                });
            }
        }).catch(() => {
            return res.json({ success: false, msg: 'Server error' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}
module.exports = {
    getuserAccount,
    createuserAccount,
    updateUserAccount,
    getUserRowById,
    deleteUserAccount,
    getuserApplications,
    updateuserApplications
};
