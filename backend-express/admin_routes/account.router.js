const passport = require('passport');
require('../config/admin_passport')(passport);
const express = require('express');
const router = express.Router();
const {updateAdminAccount,getuserAccount} = require('../admin_controllers/accounts.controller');
router.post('/update-myaccount', passport.authenticate('admin', {session: false}), updateAdminAccount);
module.exports = router;

