var apassport = require('passport');
require('../config/admin_passport')(apassport);
const { Report, User } = require('../models');
const { getToken } = require('../utils/api.helpers');
const { nodeMailerPass, nodeMailerUser } = require('../config/config');
const nodemailer = require('nodemailer');
const pug = require('pug');
const moment = require('moment');
const payoutConfirm = pug.compileFile(process.cwd() + '/admin-email-templates/payout-confirm.pug');
const payoutRejected = pug.compileFile(process.cwd() + '/admin-email-templates/payout-rejected.pug');
function getTurnoverPayouts(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        let pageLimit = parseInt(req.query.pageLimit);
        let scheme = (req.query.scheme);
        let skippage = pageLimit * (req.query.page - 1);
        let status = ['Requested', 'Paid','Rejected'];
        var query = { brand: scheme, status: { $in: status } };
        if (req.query.searchKey && req.query.searchBy) {
            query[req.query.searchBy] = new RegExp(req.query.searchKey, 'i');
        }
        if (req.query.status) {
            query['status'] = new RegExp(req.query.status, 'i');
        }
        Report.find(query).skip(skippage).limit(pageLimit).sort({ belongsToUser: -1 })
            .then(results => {
                if (results.length === 0) return res.status(200).send({ success: false, 'results': [], totalCount: 0 });
                Report.count(query).then(userCounts => {
                    return res.status(200).send({ success: true, 'results': results, totalCount: userCounts });
                });
            }).catch((err) => {
                return res.json({ success: false, msg: 'Server error' });
            });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function getCashbackRowById(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        Report.findById(req.query._id).then(cashbackRow => {
            if (cashbackRow.length === 0) return res.status(200).send({ success: false });

            User.findById(cashbackRow.belongsToUser, { password: 0 }).then(userRow => {
                if (cashbackRow.length === 0) return res.status(200).send({ success: false });
                return res.status(200).send({ success: true, 'cashbackRow': cashbackRow, 'userRow': userRow, });
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


function updateuserCashback(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { userData, reportDetails } = body;
        if (!userData.paymentType) return res.send({ success: false, message: 'Payment method missing.' });
        if (!userData.paymentEmail) return res.send({ success: false, message: 'Payment email missing.' });


        let updateData = {};

        User.findById({ _id: reportDetails.belongsToUser }).then(user => {
            if (!user) throw { status: 400, msg: 'User not found.' };

            Report.findById({ _id: reportDetails._id }).then(reportRow => {
                if (!reportRow) throw { status: 400, msg: 'Report not found.' };
                updateData.status = 'Paid';
                updateData.paymentType = userData.paymentType;
                updateData.paymentEmail = userData.paymentEmail;
                updateData.notes = userData.notes;
                Report.findByIdAndUpdate({ _id: reportRow._id }, { $set: updateData })
                    .then(() => {
                        const name = user.firstName + ' ' + user.lastName;
                        const email = user.email;
                        const brand = reportRow.brand;
                        const accountId = reportRow.account.accountId;
                        const paymentEmail = userData.paymentEmail;
                        const transValue = reportRow.account.transValue;
                        const cashback = reportRow.account.cashback;
                        const method = userData.paymentType;

                        const date = moment().format('MMM Do YYYY');
                        const mailOptions = {
                            from: nodeMailerUser,
                            to: email,
                            subject: `Your cashback payment of ${cashback} account ${accountId} has been made`,
                            replyTo: nodeMailerUser,
                        }
                        mailOptions.html = payoutConfirm({ name: name, brand: brand, accountId: accountId, paymentEmail: paymentEmail, transfers: transValue, cashback: cashback, method: method, date: date });
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: nodeMailerUser,
                                pass: nodeMailerPass
                            }
                        })
                        transporter.sendMail(mailOptions).then((email) => {
                            if (email.rejected.length === 0) {
                                return res.status(201).send({ success: true, msg: 'Cashback confirmed successfully!' });
                            }
                        }).catch(err => {
                            return res.json({ success: false, msg: 'server error 1' })
                        })
                    }).catch((err) => {
                        console.log('err', err);
                        return res.json({ success: false, msg: 'Server error 2' });
                    });

            }).catch(() => {
                return res.json({ success: false, msg: 'Server error 3' });
            });

        }).catch((err) => {

            return res.json({ success: false, msg: 'Server error 4' });
        });


    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}

function updateRejectCashback(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { userid, _id ,reason} = body;
        if (!_id) return res.send({ success: false, message: 'ID missing.' });
        let updateData = {};
        User.findById({ _id: userid }).then(user => {
            if (!user) throw { status: 400, msg: 'User not found.' };

            Report.findById({ _id }).then(reportRow => {
                if (!reportRow) throw { status: 400, msg: 'Report not found.' };
                updateData.status = 'Rejected';
                Report.findByIdAndUpdate({ _id: reportRow._id }, { $set: updateData })
                    .then(() => {
                        const name = user.firstName + ' ' + user.lastName;
                        const email = user.email;                        
                        const brand = reportRow.brand;
                        const accountId = reportRow.account.accountId;
                        const paymentEmail = user.email;
                        const transValue = reportRow.account.transValue;
                        const cashback = reportRow.account.cashback;                         
                        const date = moment().format('MMM Do YYYY');
                        const mailOptions = {
                            from: nodeMailerUser,
                            to: email,
                            subject: `Your payout request of ${cashback} account ${accountId} has been rejected`,
                            replyTo: nodeMailerUser,
                        }
                        mailOptions.html = payoutRejected({ name: name, brand: brand, accountId: accountId, paymentEmail: paymentEmail, transfers: transValue,reason:reason, cashback: cashback, date: date });
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: nodeMailerUser,
                                pass: nodeMailerPass
                            }
                        })
                        transporter.sendMail(mailOptions).then((email) => {
                            if (email.rejected.length === 0) {
                                return res.status(201).send({ success: true, msg: 'Payout rejected successfully!' });
                            }
                        }).catch(err => {
                            return res.json({ success: false, msg: 'server error' })
                        })
                    }).catch((err) => {
                        return res.json({ success: false, msg: 'Server error' });
                    });

            }).catch(() => {
                return res.json({ success: false, msg: 'Server error' });
            });

        }).catch((err) => {
            console.log('err 4', err);
            return res.json({ success: false, msg: 'Server error' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}


module.exports = {
    getTurnoverPayouts,
    updateuserCashback,
    getCashbackRowById,
    updateRejectCashback
};
