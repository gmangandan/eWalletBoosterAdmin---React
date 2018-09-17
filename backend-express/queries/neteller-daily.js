/* eslint-disable (dot-notation) */
const request = require('superagent');
const parseString = require('xml2js').parseString;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {
    CURRENT_MONTH_NET_URL
} = require('../config/config'); 



const util = require('util');
const parseStringPromise = util.promisify(parseString);
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {Report, Account, Application} = require('../models/index');
const {sendApplicationResult, sendMonthStatsOnFriday} = require('../lib/email.helpers');
// refactor below to use moment
const monthLookup = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

const dayLookup = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'    
}

const today = new Date();
let dd = today.getDate();
if(dd < 10) { dd = '0' + dd }
let mm = today.getMonth()+1;
if(mm < 10) { mm = '0' + mm }
const yyyy = today.getFullYear(); 
const month = monthLookup[today.getMonth()+1];       
// const monthId = `${month} ${yyyy}`;
const monthId = 'August 2018';


function fetchDailyNetellerAccounts () {
    
    request
    .get(CURRENT_MONTH_NET_URL)
    .then(report => {
        const urlQueries = qs.parse(report.request.url);
        const xmlData = report.text;
        return Promise.all([parseStringPromise(xmlData), urlQueries]);
    })
    .then(([reports, urlQueries]) => { 
        
        if(!reports['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0].reportresponse) {
            if (reports['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'][0].faultstring[0] === 'no permission 1') {
                throw new Error('Permission to access API denied');
            } else {
                throw new Error('No reports found'); 
            }
        }
        return Promise.all([reports['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0].reportresponse[0].row, urlQueries]); 
    })
    .then(([data, urlQueries]) => {
       
        // this is the process of mapping the data from neteller to accounts, reports and users
        // reports belong to accounts
        // accounts belong to users
        // applications belongs to users
       
        // function needs to run 3 times per day
        // first call maps any new accounts and sets belongs to if any matching applications
        // second call maps any new reports for new and exisitng accounts
        // third call updates stats and applications for exisiting accounts

        // If server call fails it is not a problem as it is just updating overall stats and then sepearting reports by monthId so it won't be wrong
        // need to create email send function for 
        return data.map(account => {

            const accountId = account.merchplayername[0];
            
            const newAccount = new Account({})

            newAccount.brand = 'Neteller';
            newAccount.account.accountId = account.merchplayername[0];
            newAccount.account.regDate = account.registrationdate[0];
            account.playercountry[0] !== '' ? newAccount.account.country = account.playercountry[0] : newAccount.account.country = 'NA';           
            newAccount.belongsTo; 

            const newReport = new Report({})
            
            newReport.monthId = monthId;
            newReport.periodId = `${urlQueries.reportstartdate} - ${urlQueries.reportenddate}`;
            newReport.brand = 'Neteller';
            newReport.status = 'Pending';
            newReport.account.accountId = account.merchplayername[0]; 
            newReport.account.regDate = account.registrationdate[0];
            account.playercountry[0] !== '' ? newReport.account.country = account.playercountry[0] : newReport.account.country = '';
            newReport.account.deposits = Math.round(account.Deposits[0] * 100) / 100;
            newReport.account.transValue = Math.round(account.trans_value[0] * 100) / 100;
            newReport.account.commission = Math.round(account.Commission[0] * 100) / 100;
            newReport.account.cashback = Math.round((account.Commission[0] * 0.785) * 100) / 100;
            newReport.account.cashbackRate;
            newReport.account.commission === 0 ? newReport.account.cashbackRate = '0%' : 
            newReport.account.cashbackRate = ((newReport.account.cashback / newReport.account.transValue) * 100).toFixed(2) + '%';   
                
            Account.create(newAccount)
            .then(account => {
                return Promise.all([
                    Application.findOneAndUpdate({accountId: account.account.accountId},
                    {linked: true},
                    {new: true}), 
                    account
                    ]
                )
                .then(([application, account]) => {
                    const data = `\n Created account with accountId: ${account.account.accountId} || ${new Date()}`;
                    fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                    
                    if(application) {
                        Promise.all([Account.findOneAndUpdate(
                            {'account.accountId': account.account.accountId},
                            { $set:{ belongsTo: application.belongsTo }}
                        ), application])                        
                        .then(([account, application]) => {
                            if(!account.belongsTo) { 
                                const data = `\n Account ${account.account.accountId} belongs to User ${application.belongsTo} || ${new Date()}`;                               
                                fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                            }      
                        })
                        .catch(err => {
                            fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                        })
                    } 
                })
                .catch(err => {
                    fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                })
            }, (err) => {
                if(err.message === 'Account already exists') {
                    // if account already exists and application comes at later date
                    Application.findOneAndUpdate(
                        {accountId: accountId },
                        {linked: true, status: 'Confirmed'},
                        {new: true},
                    )
                    .then(application => {
                        if(application) {                                                    
                            Promise.all([Account.findOneAndUpdate(
                                {'account.accountId': accountId},
                                { $set:{ belongsTo: application.belongsTo }}
                            ), application]) 
                            .then(([account, application]) => { 
                                if(!account.belongsTo) { 
                                    sendApplicationResult(application.belongsTo, account.brand, application.accountId, application.accountEmailAddress)
                                    const data = `\n Account ${account.account.accountId} belongs to User ${application.belongsTo} || ${new Date()}`;                               
                                    fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                }                                
                            })
                            .catch(err => {
                                fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                            })                                
                        } 
                    })
                    .catch(err => {
                        fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                    })
                    // saving report and updating belongsTo. If report exists for current month, it updates stats.
                    Report.create(newReport)
                    .then(report => {               
                        return Promise.all([Account.findOne({'account.accountId': report.account.accountId}), report]) 
                        .then(([account, report]) => {                    
                        Report.findOneAndUpdate(                       
                                {'account.accountId': account.account.accountId, monthId: report.monthId},
                                { $set:{ belongsTo: account._id}},
                                {new: true}
                            ).then((report) => {                               
                                const data = `\n Report for ${report.account.accountId} set to belongsTo to account ${report.belongsTo} || ${new Date()}`;                               
                                fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                            })
                            .catch(err => {
                                fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                            })
                        })
                        .catch(err => {
                            fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);       
                        })                
                    }, (err) => {
                        if(err.message === 'Report already exists') {
                            Report.findOneAndUpdate(
                                {'account.accountId': accountId, monthId: monthId}, 
                                { $set: { 
                                    'account.deposits': Math.round(account.Deposits[0] * 100) / 100, 
                                    'account.transValue': Math.round(account.trans_value[0] * 100) / 100,
                                    'account.commission': Math.round(account.Commission[0] * 100) / 100,
                                    'account.cashback': Math.round((account.Commission[0] * 0.785) * 100) / 100,
                                    'account.cashbackRate': ((((Math.round((account.Commission[0] * 0.785)* 100) / 100) / account.trans_value[0]) * 100).toFixed(2)) + '%'
                                }},  
                            )
                            .then((report) => {
                                if (report.belongsToUser !== undefined && dayLookup[moment().weekday()] === 'Friday') {
                                    // sendMonthStatsOnFriday(report) 
                                    // send email with monthly update || only possible if we update once-per-24-hours otherwise will send too many
                                    return Promise.all([Account.findOne({'account.accountId': report.account.accountId}), report]) 
                                }
                                return Promise.all([Account.findOne({'account.accountId': report.account.accountId}), report]) 
                            })
                            .then(([account, report]) => {  
                                if(account.belongsTo && !report.belongsToUser) {
                                    Report.findOneAndUpdate(
                                       {_id: report._id, monthId: monthId},
                                       { $set: { belongsToUser: account.belongsTo }} 
                                    )
                                    .then(report => {
                                        const data = `\n Updated belongsToUser for Report ${report.monthId} for ${report.account.accountId} || ${new Date()}`;
                                        fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                                    })
                                }
                            })
                            .catch(err => {
                                fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                            })
                        }
                    })
                    .catch(err => {
                        fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
                    })
                }
            })
            .catch(err => {
                fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            })
        })
    })     
    .catch(err => {
        fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
    })
}




module.exports = {
    fetchDailyNetellerAccounts
}



