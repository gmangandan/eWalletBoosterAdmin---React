const passport = require('passport');
require('../config/admin_passport')(passport);
const express = require('express');
const router = express.Router();
const {
    getTurnoverCashback,
    updateuserCashback,
    uploadCsvData
} = require('../admin_controllers/turnovercashback.controller');
router.get('/list', passport.authenticate('admin', { session: false }), getTurnoverCashback);
router.post('/confirm', passport.authenticate('admin', { session: false }), updateuserCashback);
router.post('/upload', passport.authenticate('admin', { session: false }), uploadCsvData);
module.exports = router;

