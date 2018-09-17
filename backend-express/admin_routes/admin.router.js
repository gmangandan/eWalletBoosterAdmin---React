const express = require('express');
const router = express.Router();
const authRouter = require('./auth.router');
const accountRouter = require('./account.router');
const userRouter = require('./user.router');
const turnoverCashback = require('./turnovercashback.router');
const payoutRouter = require('./payout.router');
const staticRouter = require('./static.router');
router.get('/', (req, res) => {
    return res.render('pages/index');
});
router.use('/auth', authRouter);
router.use('/account', accountRouter);
router.use('/users', userRouter);
router.use('/cashback', turnoverCashback);
router.use('/payout', payoutRouter);
router.use('/static', staticRouter);
module.exports = router;

