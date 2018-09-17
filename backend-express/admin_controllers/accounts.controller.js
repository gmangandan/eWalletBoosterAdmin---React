var apassport = require('passport');
require('../config/admin_passport')(apassport);
const Admin = require('../admin_models/Admin');
const { getToken } = require('../utils/api.helpers');
function updateAdminAccount(req, res, next) {
    const token = getToken(req.headers);
    if (token) {
        const { body } = req;
        const { _id, firstName, username, email, password, cpassword, } = body.userData;
        if (!firstName) return res.send({ success: false, message: 'Please enter your name.' });
        if (!username) return res.send({ success: false, message: 'Please enter your username.' });
        if (!email) return res.send({ success: false, message: 'Please enter your email address.' });
        if (req.body.changePass) {
            if (!password) return res.send({ success: false, message: 'Please enter your password.' });
            if (!cpassword) return res.send({ success: false, message: 'Please confirm your password.' });
        }
        Admin.findById({
            _id
        }).then(user => {
            if (!user) throw { status: 400, msg: 'Invalid Account.' };
            Admin.find({ username: username, _id: { $ne: _id } }).then(existUser => {
                if (existUser.length > 0) return res.status(400).send({ success: false, msg: 'Username already exists.' });
                Admin.find({ email: email, _id: { $ne: _id } }).then(existEmail => {
                    if (existEmail.length > 0) return res.status(400).send({ success: false, msg: 'Email already exists.' });
                    let updateData = {
                        firstName: firstName,
                        username: username,
                        email: email
                    };
                    if (req.body.changePass) updateData.password = user.generateHash(password);
                    Admin.findByIdAndUpdate({ _id: user._id }, { $set: updateData })
                        .then(() => {
                            return res.status(201).send({ success: true, msg: 'Account updated successfully!' });
                        }).catch(() => {
                            return res.json({ success: false, msg: 'server error' });
                        });
                }).catch(() => {
                    return res.json({ success: false, msg: 'server error' });
                });
            }).catch(() => {
                return res.json({ success: false, msg: 'server error' });
            });
        }).catch(err => {
            if (err.status === 400) res.status(400).send({ success: false, msg: err.msg });
            else return next({ status: 500, message: 'server error' });
        })
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorised' });
    }
}


module.exports = {
    updateAdminAccount
    
};
