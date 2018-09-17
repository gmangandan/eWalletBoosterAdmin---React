const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const {
    getAllReports,
    getReportsById,
    getReportsForAccounts,
    getReportsByAccId
} = require('../controllers/report.controller');

// GET all the reports
router.get('/', getAllReports);

// GET reports for account (which has a user)
router.get('/user', passport.authenticate('jwt', {session: false}), getReportsForAccounts);

// Get reports by account _id (report belongsTo (which is an account / not a user))
router.get('/id/:id', getReportsById);

// GET reports by accountId e.g 450087562367
router.get('/accountid/:accountid', passport.authenticate('jwt', {session: false}), getReportsByAccId)

module.exports = router;
