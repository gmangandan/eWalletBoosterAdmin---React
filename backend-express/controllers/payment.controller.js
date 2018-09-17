// import models / db connections
const {Report, Payment} = require('../models/index');
const {getToken} = require('../utils/api.helpers');
const {sendPaymentRequest} = require('../lib/email.helpers');

// GET all reports
function getAllPayments (req, res, next) {
    return Payment.find({})
    .then(payments => {
        if (payments.length === 0) throw {status: 404, message: `No payments found`};
        return res.status(200).send(payments);
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    });
}

// POST new payment request
function addPaymentRequest (req, res, next) { 
    const token = getToken(req.headers);  
    if (token) {
        const newPayment =  new Payment({
            status: req.body.status,
            month: req.body.month,
            accountId: req.body.accountId,
            belongsTo: req.body.belongsTo,
            cashback: req.body.cashback
        });
    
        Payment.create(newPayment)
        .then(payment => {
            return Promise.all([payment, Report.findByIdAndUpdate(
                {_id: payment.belongsTo},
                { $set:{ status: payment.status }},
                {new: true},
            )])
            .then((payment) => {
                sendPaymentRequest(payment[0], req.user.firstName, req.user.lastName, req.user.email)
                return res.status(201).send({success: true, msg: 'Submitted payout request'});
            })
            .catch(() => {
                return next({status: 500, message: 'server error'});
            });
        })
        .catch(() => {
            return next({status: 500, message: 'server error'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorised'});
    }  
}


module.exports = {
    addPaymentRequest,
    getAllPayments
}