var apassport = require('passport');
require('../config/admin_passport')(apassport);
const { Report, User, Account, Application } = require('../models');
const { getToken, random } = require('../utils/api.helpers');
const nodemailer = require('nodemailer');
const pug = require('pug');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
var CsvReadableStream = require('csv-reader');
const cashbackConfirm = pug.compileFile(process.cwd() + '/admin-email-templates/cashback-confirm.pug');

function getTurnoverCashback(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        let pageLimit = parseInt(req.query.pageLimit);
        let scheme = (req.query.scheme);
        let skippage = pageLimit * (req.query.page - 1);
        let status = ['Requested', 'Paid'];
        var query = { brand: scheme, status: { $nin: status } };

        if (req.query.searchKey && req.query.searchBy) {
            query[req.query.searchBy] = new RegExp(req.query.searchKey, 'i');
        }
        if (req.query.status) {
            query['status'] = new RegExp(req.query.status, 'i');
        }
        Report.find(query).skip(skippage).limit(pageLimit).sort({ belongsToUser: -1 })
            .then(results => {
                if (results.length === 0) return res.status(200).send({ success: false, 'results': [], totalCount: 0,totalSum: 0, totalPaidSum: 0,totalUsers:0 });
                Report.count(query).then(userCounts => {
                    Report.aggregate([{ $match: { brand: scheme } }, { $group: { _id: null, sum: { $sum: "$account.cashback" } } }]).then(totalSum => {
                        Report.aggregate([{ $match: { brand: scheme, status: 'Paid' } }, { $group: { _id: null, sum: { $sum: "$account.cashback" } } }]).then(totalPaidSum => {
                            Account.aggregate([{$match:{brand:scheme}},{$group:{_id:null,sum:{$sum:1}}}]).then(totalUsers=>{
                                return res.status(200).send({ success: true, results: results, totalCount: userCounts, totalSum: totalSum, totalPaidSum: totalPaidSum,totalUsers:totalUsers });
                            });
                           
                        });
                    });

                });
            }).catch((err) => {
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
        const { userid, _id } = body;
        if (!_id) return res.send({ success: false, message: 'ID missing.' });
        let updateData = {};
        User.findById({ _id: userid }).then(user => {
            if (!user) throw { status: 400, msg: 'User not found.' };

            Report.findById({ _id }).then(reportRow => {
                if (!reportRow) throw { status: 400, msg: 'Report not found.' };
                updateData.status = 'Confirmed';
                Report.findByIdAndUpdate({ _id: reportRow._id }, { $set: updateData })
                    .then(() => {
                        const name = user.firstName + ' ' + user.lastName;
                        // const email = user.email;
                        const email = 'manigandan.g@officialgates.com';
                        const brand = reportRow.brand;
                        const accountId = reportRow.account.accountId;
                        const paymentEmail = user.email;
                        const transValue = reportRow.account.transValue;
                        const cashback = reportRow.account.cashback;

                        const date = moment().format('MMM Do YYYY');
                        const mailOptions = {
                            from: 'test@officialgates.com',
                            to: email,
                            subject: `Your cashback for ${brand} account ${accountId} has been Confirmed`,
                            replyTo: 'test@officialgates.com',
                        }
                        mailOptions.html = cashbackConfirm({ name: name, brand: brand, accountId: accountId, paymentEmail: paymentEmail, transfers: transValue, cashback: cashback, date: date });
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'test@officialgates.com',
                                pass: 'chennai@999333'
                            }
                        })
                        transporter.sendMail(mailOptions).then((email) => {
                            if (email.rejected.length === 0) {
                                return res.status(201).send({ success: true, msg: 'Cashback confirmed successfully!' });
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

function uploadCsvData(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayLookup = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            7: 'Sunday'
        }
        const d = new Date();
        const curMonth = monthNames[d.getMonth()];
        const curYear = d.getFullYear();
        // const monthId = `${curMonth} ${curYear}`;
        const monthId = 'June 2018';
        const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const firstDay = moment(firstDayOfMonth).format("YYYY/MM/DD");
        const lastDay = moment(lastDayOfMonth).format("YYYY/MM/DD");

        let transactionFile = req.files.file;
        let filename = path.join(__dirname, '../csv/transactionFile.csv');
        transactionFile.mv(filename, function (err) {
            if (err) return res.status(500).send(err);
            var accountData = [];
            var inputStream = fs.createReadStream(filename, 'utf8');
            inputStream.pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
                .on('data', function (row) {
                    
                    accountData.push(row);
                })
                .on('end', function (data) {
                    return res.send({ success: false, message: 'Invalid file format.' });
                    let endLoop = false;
                    if (accountData.length > 0) {
                        for (key in accountData) {
                            if (key === '0') {
                                if (accountData[key][4] !== 'ecoAccount' && accountData[key][5] !== 'PurchaseVolume' && accountData[key][6] !== 'Revenue') {
                                    return res.send({ success: false, message: 'Invalid file format.' });
                                }
                            }
                            if (key !== '0') {
                                const trackingCode = accountData[key][0];
                                const regDate = accountData[key][1];
                                const firstName = accountData[key][2];
                                const LastName = accountData[key][3];
                                const ecoAccount = accountData[key][4];
                                const purchaseVolume = accountData[key][5];
                                const revenue = accountData[key][6];
                                const accountId = ecoAccount;
                                const newAccount = new Account();
                                newAccount.brand = 'Ecopayz';
                                newAccount.account.accountId = ecoAccount;
                                newAccount.account.regDate = regDate;
                                newAccount.account.country = 'NA';
                                newAccount.belongsTo;

                                const newReport = new Report();
                                newReport.monthId = monthId;
                                newReport.periodId = `${firstDay} - ${lastDay}`;
                                newReport.brand = 'Ecopayz';
                                newReport.status = 'Pending';
                                newReport.account.accountId = ecoAccount;
                                newReport.account.regDate = regDate;
                                newReport.account.country = '';
                                newReport.account.deposits = purchaseVolume;
                                newReport.account.transValue = purchaseVolume;
                                newReport.account.commission = 0;
                                newReport.account.cashback = revenue;
                                newReport.account.cashbackRate = '0%';

                                Account.create(newAccount)
                                    .then(account => {
                                        return Promise.all([
                                            Application.findOneAndUpdate({ accountId: account.account.accountId },
                                                { linked: true },
                                                { new: true }),
                                            account
                                        ]
                                        ).then(([application, account]) => {
                                            const data = `\n Created account with accountId: ${account.account.accountId} || ${new Date()}`;
                                            fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                            if (application) {
                                                Promise.all([Account.findOneAndUpdate(
                                                    { 'account.accountId': account.account.accountId },
                                                    { $set: { belongsTo: application.belongsTo } }
                                                ), application]).then(([account, application]) => {
                                                    if (!account.belongsTo) {
                                                        const data = `\n Account ${account.account.accountId} belongs to User ${application.belongsTo} || ${new Date()}`;
                                                        fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                                    }
                                                }).catch(err => {
                                                    return res.send({ success: false, message: 'Server Error.' });
                                                })
                                            }
                                        }).catch(err => {
                                            return res.send({ success: false, message: 'Server Error.' });
                                        })
                                    }, (err) => {
                                        if (err.message === 'Account already exists') {
                                            // if account already exists and application comes at later date
                                            Application.findOneAndUpdate(
                                                { accountId: accountId },
                                                { linked: true, status: 'Confirmed' },
                                                { new: true },
                                            ).then(application => {
                                                if (application) {
                                                    Promise.all([Account.findOneAndUpdate(
                                                        { 'account.accountId': accountId },
                                                        { $set: { belongsTo: application.belongsTo } }
                                                    ), application]).then(([account, application]) => {
                                                        if (!account.belongsTo) {
                                                            sendApplicationResult(application.belongsTo, account.brand, application.accountId, application.accountEmailAddress)
                                                            const data = `\n Account ${account.account.accountId} belongs to User ${application.belongsTo} || ${new Date()}`;
                                                            fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                                        }
                                                    }).catch(err => {
                                                        return res.send({ success: false, message: 'Server Error.' });
                                                    })
                                                }
                                            }).catch(err => {
                                                return res.send({ success: false, message: 'Server Error.' });
                                            })

                                        }
                                    }).catch(err => {
                                        return res.send({ success: false, message: 'Server Error.' });
                                    })

                                Report.create(newReport).then(report => {
                                    return Promise.all([Account.findOne({ 'account.accountId': report.account.accountId }), report])
                                        .then(([account, report]) => {
                                            Report.findOneAndUpdate(
                                                { 'account.accountId': account.account.accountId, monthId: report.monthId },
                                                { $set: { belongsTo: account._id } },
                                                { new: true }
                                            ).then((report) => {
                                                const data = `\n Report for ${report.account.accountId} set to belongsTo to account ${report.belongsTo} || ${new Date()}`;
                                                fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                                return Promise.all([Account.findOne({ 'account.accountId': report.account.accountId }), report])
                                            }).then(([account, report]) => {
                                                if (account.belongsTo && !report.belongsToUser) {
                                                    Report.findOneAndUpdate(
                                                        { _id: report._id, monthId: monthId },
                                                        { $set: { belongsToUser: account.belongsTo } }
                                                    ).then(report => {
                                                        const data = `\n Updated belongsToUser for Report ${report.monthId} for ${report.account.accountId} || ${new Date()}`;
                                                        fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                                    })
                                                }
                                            }).catch(err => {

                                                return res.send({ success: false, message: 'Server Error.' });
                                            })
                                        }).catch(err => {

                                            return res.send({ success: false, message: 'Server Error.' });
                                        })
                                }, (err) => {
                                    console.log('err.message', err.message);
                                    if (err.message === 'Report already exists') {
                                        Report.findOneAndUpdate(
                                            { 'account.accountId': accountId, monthId: monthId },
                                            {
                                                $set: {
                                                    'account.deposits': Math.round(purchaseVolume * 100) / 100,
                                                    'account.transValue': Math.round(purchaseVolume * 100) / 100,
                                                    'account.commission': 0,
                                                    'account.cashback': Math.round(revenue * 100) / 100,
                                                    'account.cashbackRate': '0%'
                                                }
                                            },
                                        ).then((report) => {
                                            return Promise.all([Account.findOne({ 'account.accountId': report.account.accountId }), report])
                                        }).then(([account, report]) => {
                                            if (account.belongsTo && !report.belongsToUser) {
                                                Report.findOneAndUpdate(
                                                    { _id: report._id, monthId: monthId },
                                                    { $set: { belongsToUser: account.belongsTo } }
                                                ).then(report => {
                                                    const data = `\n Updated belongsToUser for Report ${report.monthId} for ${report.account.accountId} || ${new Date()}`;
                                                    fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                                })
                                            }
                                        }).catch(err => {
                                            console.log('err 2', err);
                                            return res.send({ success: false, message: err });
                                        })
                                    }
                                }).catch(err => {
                                    return res.send({ success: false, message: 'Server Error.' });
                                })
                            }
                            if (parseInt(accountData.length - 1) === parseInt(key)) {
                                endLoop = true;

                            }
                        }

                        if (endLoop) {
                            return res.send({ success: true, message: 'Uploaded successfully!.' });
                        }

                    }
                });
        });

    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }

}


module.exports = {
    getTurnoverCashback,
    updateuserCashback,
    uploadCsvData
};
