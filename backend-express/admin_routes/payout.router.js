const passport = require('passport');
require('../config/admin_passport')(passport);
const express = require('express');
const router = express.Router();
const {
    getTurnoverPayouts,
    getCashbackRowById,
    updateuserCashback,
    updateRejectCashback
} = require('../admin_controllers/payout.controller');
router.get('/list', passport.authenticate('admin', { session: false }), getTurnoverPayouts);
router.get('/cashback-row', passport.authenticate('admin', { session: false }), getCashbackRowById);
router.post('/updatecashback', passport.authenticate('admin', { session: false }), updateuserCashback);
router.post('/reject', passport.authenticate('admin', { session: false }), updateRejectCashback);

module.exports = router;

