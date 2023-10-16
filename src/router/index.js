const router = require('express').Router();
const authRouter = require('../app/auth/auth.router.js')

// mounting authRouter to our main app router
router.use(authRouter);




module.exports = router;