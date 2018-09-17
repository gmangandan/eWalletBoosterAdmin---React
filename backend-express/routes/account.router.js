const express = require('express');
const passport = require('passport');
require('../config/passport')(passport);
const router = express.Router();
const {
    getAccountsForUser,
    getAccountsByCountryCode
} = require('../controllers/account.controller');

// GET the accounts for a user
router.get('/user', passport.authenticate('jwt', {session: false}), getAccountsForUser);

// GET accounts by country code
router.get('/:country', getAccountsByCountryCode);

module.exports = router;
