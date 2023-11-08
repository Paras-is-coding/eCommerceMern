const router = require('express').Router();
const authRouter = require('../app/auth/auth.router.js');
const bannerRouter = require('../app/banner/banner.router.js');


// mounting authRouter to our main app router
router.use(authRouter);
router.use('/banner',bannerRouter);



module.exports = router;