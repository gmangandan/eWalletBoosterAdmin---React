const express = require('express');
const router = express.Router();
const reportRouter = require('./report.router');
const userRouter = require('./user.router');
const accountRouter = require('./account.router');
const applicationRouter = require('./application.router');
const paymentRouter = require('./payment.router');
const statictextRouter = require('./statictext.router');
router.get('/', (req, res) => {
    return res.render('pages/index');
});

router.use('/accounts', accountRouter);

router.use('/reports', reportRouter);

router.use('/users', userRouter);

router.use('/applications', applicationRouter);

router.use('/payments', paymentRouter);
router.use('/statictext', statictextRouter);

module.exports = router;

