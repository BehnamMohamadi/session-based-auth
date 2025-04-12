const router = require('express').Router();

const authRouter = require('./auth-route');
const userRouter = require('./user-route');

const accountRouter = require('./account-route');

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/account', accountRouter);

module.exports = router;
