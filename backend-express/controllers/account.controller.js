// import models / db connections
const {Account} = require('../models/index');
const {getToken} = require('../utils/api.helpers');

// GET the accounts for a user
// router.get('/user', getAccountsForUser);
function getAccountsForUser (req, res, next) {    
    const token = getToken(req.headers);   
     
    if (token) {             
        // the user object is collected via passport middleware and returned in req.user object
        return Account.find({belongsTo: req.user._id}, { password: 0 })
        // excluding the password from being sent to client by adding in the {password: 0} as the second argument of the query
        .then(accounts => { 
            if (accounts.length === 0) throw {status: 404, msg: `There are no accounts for ${req.user._id}`};
            return res.status(200).send(accounts);
        })
        .catch(err => {
            if (err.status === 404) res.status(404).send({success: false, msg: err.msg});
            else return next({status: 500, message: 'server error'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorised'});
    }    
}

// GET accounts by country code
function getAccountsByCountryCode (req, res, next) {
    let countryCode = req.params.country.toUpperCase();    
    return Account.find({'account.country': countryCode})
    .then(accounts => {
        if (accounts.length === 0) throw {status: 404, msg: `There are no accounts with country code: ${countryCode}`};
        else return res.status(200).send({accounts});
    })
    .catch(err => {
        if (err.status === 404) res.status(404).send({success: false, msg: err.msg});
        else return next({status: 500, message: 'server error'});
    });
}

module.exports = {
    getAccountsForUser,
    getAccountsByCountryCode
};
