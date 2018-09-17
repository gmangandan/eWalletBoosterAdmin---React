const express = require('express');
const router = express.Router();
const apiRouter = require('./api.router');
const authRouter = require('./auth.router');
const emailRouter = require('./email.router');

// routes
router.use('/api', apiRouter);

router.use('/auth', authRouter);

router.use('/email', emailRouter);

module.exports = router;
