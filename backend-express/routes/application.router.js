const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const {
    getApplicationsForUser,
    getApplicationsByBrand,
    addNewApplication   
} = require('../controllers/application.controller');

// GET all the applications
// router.get('/', getAllApplications);

// Get applications by belongsTo
router.get('/user', passport.authenticate('jwt', {session: false}), getApplicationsForUser);

// GET applications by brand
router.get('/:brand', getApplicationsByBrand);

// POST application by brand
router.post('/:brand', addNewApplication);

module.exports = router;
