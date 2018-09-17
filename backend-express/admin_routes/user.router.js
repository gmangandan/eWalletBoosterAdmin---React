const passport = require('passport');
require('../config/admin_passport')(passport);
const express = require('express');
const router = express.Router();
const {
    getuserAccount,
    createuserAccount,
    getUserRowById,
    updateUserAccount,
    deleteUserAccount,
    getuserApplications,
    updateuserApplications
} = require('../admin_controllers/user.controller');
router.get('/list', passport.authenticate('admin', { session: false }), getuserAccount);
router.post('/create', passport.authenticate('admin', { session: false }), createuserAccount);
router.get('/user-row', passport.authenticate('admin', { session: false }), getUserRowById);
router.post('/updateuser', passport.authenticate('admin', { session: false }), updateUserAccount);
router.post('/deleteuser', passport.authenticate('admin', { session: false }), deleteUserAccount);
router.get('/applications', passport.authenticate('admin', { session: false }), getuserApplications);
router.post('/updateapplication', passport.authenticate('admin', { session: false }), updateuserApplications);
module.exports = router;

