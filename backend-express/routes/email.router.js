const express = require('express');
const router = express.Router();
const {sendContactForm, forgotPass, resetPass} = require('../controllers/email.controller');

router.post('/contact', sendContactForm);

router.post('/forgot-password', forgotPass);

router.post('/reset-password', resetPass);

module.exports = router;


