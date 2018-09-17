/* eslint-disable camelcase */
if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const {
    User,
    Account,
    Report,
    Application
} = require('../models/index');

const userData = require('./data/users.json');
const reportData = require('./data/monthly-report.json');
const accountData = require('./data/accounts.json');
const applicationData = require('./data/applications.json');
const {LOCAL_DB_URL} = require('../config/config');
// Connect to correct database for dev or testing

const DB_URL = 'mongodb://db_mckenna:Abcdef123@ds139841.mlab.com:39841/ewalletbooster';

function seedDatabase(url) {

    return mongoose.connect(url)
        .then(() => {
            return mongoose.connection.dropDatabase();
        })
        .then(() => {

            const REPORTS = reportData.map(report => {

                report.member = {};                
                report.member.member_name = report.member_name;
                report.member.member_deposits = report.member_deposits;
                report.member.member_trans_value = report.member_trans_value;
                report.member.member_commission = report.member_commission;
                report.member.member_cashback = report.member_commission * 0.785;

                delete report.member_name;
                delete report.member_deposits;
                delete report.member_trans_value;
                delete report.member_commission;

                return report;
            });

            console.log(`Successfully seeded ${REPORTS.length} monthly reports for ${REPORTS[0].period} `);
            return Report.insertMany(REPORTS);

        })
        .then(() => {
            return Promise.all([User.insertMany(userData)]);
        })
        .then(([users]) => {
            console.log(`Successfully seeded ${users.length} user accounts`);

            const ACCOUNTS = accountData.map(account => {

                let userNetId = users.find(user => {
                    return user.neteller_account_id === account.member;
                });

                account.belongs_to = userNetId;
                account.account_id = account.member;
                account.reg_date = account.sign_up_date;
                account.membercountry !== '' ? account.country = account.membercountry : account.country = 'N/A';

                delete account.member;
                delete account.sign_up_date;
                delete account.membercountry;

                return account;
            });

            return Promise.all([Account.insertMany(ACCOUNTS)]);
        })
        .then(([accounts]) => {
            console.log(`Successfully seeded ${accounts.length} Neteller accounts`);
            return Promise.all([applicationData]);
        })
        .then(([applicationData]) => {
            console.log(`Successfully seeded ${applicationData.length} applications`);
            return Application.insertMany(applicationData); 
        })
        .then(() => {
            return mongoose.connection.close(applicationData);
        })     
        .catch(err => {
            console.log(err);
        });

}

seedDatabase(LOCAL_DB_URL);
