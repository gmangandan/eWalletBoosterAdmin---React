const passport = require('passport');
require('../config/passport')(passport);
const express = require('express');
const router = express.Router();
const {createNewUser, userLogin} = require('../controllers/auth.controller');

router.post('/register', createNewUser);

router.post('/login', userLogin);

module.exports = router;

