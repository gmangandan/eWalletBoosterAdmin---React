/* eslint-disable (dot-notation) */
const request = require('superagent');
const parseString = require('xml2js').parseString;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {
    LAST_MONTH_NET_URL
} = require('../config/config');
const util = require('util');
const parseStringPromise = util.promisify(parseString);
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const {Report, Account} = require('../models/index');
const {sendFinalMonthlyStats} = require('../lib/email.helpers');


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

const today = new Date();
let dd = today.getDate();
if(dd < 10) { dd = '0' + dd }
let mm = today.getMonth()+1;
if(mm < 10) { mm = '0' + mm }
const yyyy = today.getFullYear(); 
const lastMonth = monthLookup[today.getMonth()];     
const lastMonthId = `${lastMonth} ${yyyy}`;


// console.log(lastMonthId)

function fetchMonthlyNetellerAccounts () {
    
    request
    .get(LAST_MONTH_NET_URL)
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

        return data.map(account => {
            
            const accountId = account.merchplayername[0];
            
            const newReport = new Report({})
            
            newReport.monthId = lastMonthId;
            newReport.periodId = `${urlQueries.reportstartdate} - ${urlQueries.reportenddate}`;
            newReport.status = 'Pending';
            newReport.brand = 'Neteller';
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
                        fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err}`);
                    })
                })
                .catch(err => {
                    fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err}`);       
                })                
            }, (err) => {
                if(err.message === 'Report already exists') {
                    
                    Report.findOneAndUpdate(
                        {'account.accountId': accountId, monthId: lastMonthId, status: {$ne: 'Requested'}}, 
                        { $set: { 
                            'status': 'Confirmed',
                            'account.deposits': Math.round(account.Deposits[0] * 100) / 100, 
                            'account.transValue': Math.round(account.trans_value[0] * 100) / 100,
                            'account.commission': Math.round(account.Commission[0] * 100) / 100,
                            'account.cashback': Math.round((account.Commission[0] * 0.785) * 100) / 100,
                            'account.cashbackRate': ((((Math.round((account.Commission[0] * 0.785)* 100) / 100) / account.trans_value[0]) * 100).toFixed(2)) + '%'
                        }},  
                    )
                    .then((report) => {
                        if (!report) throw {status: 404, message: 'No report found for this monthId'};
                        else if (report.belongsToUser !== undefined) {
                            const data = `\n Updated final report stats for ${report.account.accountId} for ${report.periodId} || ${new Date()}` + `\n Set status for ${report.account.accountId} for ${report.periodId} to 'Confirmed' || ${new Date()}`;
                            fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                            // sending monthly stats and confirmation cashback is payable
                            sendFinalMonthlyStats(report);
                            return Promise.all([Account.findOne({'account.accountId': report.account.accountId}), report]) 
                        }
                        const data = `\n Updated final report stats for ${report.account.accountId} for ${report.periodId} || ${new Date()}` + `\n Set status for ${report.account.accountId} for ${report.periodId} to 'Confirmed' || ${new Date()}`;
                        fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                        return Promise.all([Account.findOne({'account.accountId': report.account.accountId}), report]) 
                    })
                    .then(([account, report]) => {  
                        if(account.belongsTo && !report.belongsToUser) {
                            Report.findOneAndUpdate(
                                {_id: report._id, monthId: lastMonthId},
                                { $set: { belongsToUser: account.belongsTo }} 
                            )
                            .then(report => {
                                const data = `\n Updated belongsToUser for Report ${report.monthId} for ${report.account.accountId} || ${new Date()}`;
                                fs.appendFileSync(path.join(__dirname, '../logs/logs.txt'), data);
                            })
                        }
                    })
                    .catch(err => {
                        fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err.status} ${err.message} || ${new Date()}`);
                    })
                }
            })
            .catch(err => {
                fs.appendFileSync(path.join(__dirname, '../logs/error_logs.txt'), `\n ${err} || ${new Date()}`);
            })
        })
    })

}

module.exports = {
    fetchMonthlyNetellerAccounts
}





