const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const {addPaymentRequest, getAllPayments} = require('../controllers/payment.controller.js');

// GET payments
router.get('/', getAllPayments);

// POST new payment request
router.post('/', passport.authenticate('jwt', {session: false}), addPaymentRequest);

module.exports = router;


