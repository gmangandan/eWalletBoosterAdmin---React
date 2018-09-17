const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const {
    getUser    
} = require('../controllers/user.controller');

// GET /api/users | gets all users
router.get('/', passport.authenticate('jwt', {session: false}), getUser);

module.exports = router;
