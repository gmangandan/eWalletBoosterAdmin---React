const passport = require('passport');
require('../config/admin_passport')(passport);
const express = require('express');
const router = express.Router();
const {
    getstaticText,
    createstaticText,
    updatestaticText,
    getstaticRowById,
    deletestaticText,

} = require('../admin_controllers/static.controller');
router.get('/list', passport.authenticate('admin', { session: false }), getstaticText);
router.post('/create', passport.authenticate('admin', { session: false }), createstaticText);
router.get('/static-row', passport.authenticate('admin', { session: false }), getstaticRowById);
router.post('/updatestatic', passport.authenticate('admin', { session: false }), updatestaticText);
router.post('/deletestatic', passport.authenticate('admin', { session: false }), deletestaticText);
module.exports = router;

