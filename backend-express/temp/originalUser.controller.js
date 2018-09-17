// import models / db connections
const {UserSchema, Account} = require('../models/index');

// GET all the users
function getAllUsers (req, res, next) {
    return UserSchema.find({})
    .then(users => {
        return res.status(200).send({users});
    })
    .catch(() => next({status: 500, message: 'server error'}));
}

// GET users by neteller_email_address
function getUsersByEmail (req, res, next) {
    let email = req.params.neteller_email_address;
    return User.findOne({neteller_email_address: email})
    .then(user => {
        if (!user) throw {status: 404, message: `There is no member with email address: ${email}`};
        else return res.status(200).send({user});
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    });
}

// Adds new user to database from registration form and sets linked: true and belong_to if applicable
function addNewUser (req, res, next) {    
    return new User({
        username: req.body.username,
        neteller_email_address: req.body.neteller_email_address,
        neteller_account_id: req.body.neteller_account_id
    }).save() 
    .then(newUser => {
        Account.findOne({account_id: newUser.neteller_account_id})
        .then(account => {           
            if (account !== null) {                              
                return Promise.all([Account.findByIdAndUpdate(account._id, {$set: {belongs_to:newUser._id}, }, {new: true}), User.findByIdAndUpdate(newUser._id, {$set: {linked:true}, }, {new: true})]); 
            } else {   
                console.log(`Account ${newUser.neteller_account_id} does not exist on database`);            
            }        
        })
        .then(([user]) => {
            return res.status(201).send(user);
        })
        .catch(err => {
            return console.log(err);
         });
    })
    .catch(() => next({status: 500, message: 'server error'}));
}

module.exports = {
    getAllUsers,
    getUsersByEmail,
    addNewUser
};
