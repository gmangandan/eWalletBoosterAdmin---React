// import models / db connections
const {Report} = require('../models/index');
const {getToken} = require('../utils/api.helpers');

// GET all the reports
function getAllReports (req, res, next) {
    return Report.find({}, { 'account.commission': 0 })
    .then(reports => {
        if (reports.length === 0) throw {status: 404, message: `No reports found`};
        return res.status(200).send(reports);
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    });
}

// GET reports for single account account (linked to user)
function getReportsForAccounts (req, res, next) {
    const token = getToken(req.headers);    
    if (token) {             
        // the user object is collected via passport middleware and returned in req.user object
        return Report.find({belongsToUser: req.user._id}, { password: 0, 'account.commission': 0 })
        // excluding the password from being sent to client by adding in the {password: 0} as the second argument of the query
        .then(reports => { 
            if (reports.length === 0) throw {status: 404, message: `Account does not have any reports`};
            else return res.status(200).send(reports);
        })
        .catch(err => {
            if (err.status === 404) return next(err);
            else return next({status: 500, message: 'server error'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorised'});
    }    
}

// GET reports by accountId e.g 450087562367
function getReportsByAccId (req, res, next) {
    return Report.find({'account.accountId': req.params.accountid}, { 'account.commission': 0 })
    .then(reports => {        
        if (reports.length === 0) throw {status: 404, message: `Account does not have any reports`};
        else return res.status(200).send(reports)        
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    });
}

// GET reports by account _id (report belongsTo)
function getReportsById (req, res, next) {    
    return Report.find({belongsTo: req.params.id}, { 'account.commission': 0 })
    .then(reports => {        
        if (reports.length === 0) throw {status: 404, message: `Account does not have any reports`};
        else return res.status(200).send(reports);
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    });
}



module.exports = {
    getAllReports,
    getReportsForAccounts,
    getReportsById,
    getReportsByAccId
};
