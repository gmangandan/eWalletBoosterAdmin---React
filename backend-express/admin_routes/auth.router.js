const passport = require('passport');
require('../config/admin_passport')(passport);
const express = require('express');
const router = express.Router();
const {createNewAdmin,adminLogin,forgotPass,resetPass,checkAuthentication} = require('../admin_controllers/auth.controller');
router.get('/check-auth', passport.authenticate('admin', {session: false}), checkAuthentication);
router.post('/register', createNewAdmin);
router.post('/login', adminLogin);
router.post('/forgot-password', forgotPass);
router.post('/reset-password', resetPass);

module.exports = router;

