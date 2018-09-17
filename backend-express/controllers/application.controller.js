/* eslint-disable camelcase */

const {Application} = require('../models/index');
const {getToken} = require('../utils/api.helpers');
const {sendApplicationSubmit} = require('../lib/email.helpers');

// GET the applications for a user
// router.get('/user', getAllApplications);
function getApplicationsForUser (req, res, next) {
    const token = getToken(req.headers);    
    if (token) {        
        // the user object is collected via passport middleware and returned in req.user object
        return Application.find({belongsTo: req.user._id}, { password: 0 })
        // excluding the password from being sent to client by adding in the {password: 0} as the second argument of the query
        .then(applications => { 
            if (applications.length === 0) throw {status: 404, msg: `No applications found for ${req.user._id}`};
            return res.status(200).send(applications);
        })
        .catch(err => {
            if (err.status === 404) res.status(404).send({success: false, msg: err.msg});
            else return next({status: 500, message: 'server error'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorised'});
    }    
}


// GET applications by brand
// router.get('/:brand', getApplicationsByBrand);
function getApplicationsByBrand (req, res, next) {
    let brand = req.params.brand;
    return Application.find({'brand': brand})
    .then(applications => {              
        if (applications.length === 0) throw {status: 404, message: `No applications found for ${brand}`};
        else return res.status(200).send(applications);
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    });
}

// POST application by brand
// router.post('/:brand', addNewApplication);
function addNewApplication (req, res, next) { 
          
    const newApplication =  new Application({
        firstName: req.body.firstName,
        lastName: req.body.lastName,        
        brand: req.body.brand,
        accountId: req.body.accountId,
        accountEmailAddress: req.body.accountEmailAddress,
        accountCurrency: req.body.accountCurrency,
        mobileNumber: req.body.mobileNumber,
        belongsTo: req.body.belongsTo,
        status: req.body.status
    });

    newApplication.save(function (err) {
        if(err) {
            if (err.message === 'Application already exists') {
                return res.json({success: false, msg: 'Application already exists'});
            }   
        } 
        else {
            const brand = req.body.brand.slice(0, 1).toUpperCase() + req.body.brand.slice(1).toLowerCase();
            sendApplicationSubmit(req.body.belongsTo, brand, req.body.accountId, req.body.accountEmailAddress, req.body.accountCurrency)
            return res.status(201).send({success: true, msg: 'Created new application'});
        }        
    });    
}





module.exports = {
    getApplicationsForUser,
    getApplicationsByBrand,
    addNewApplication
};

