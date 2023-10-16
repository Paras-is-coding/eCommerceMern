const router = require('express').Router();
const authCtrl = require('./auth.controller.js');
const uploader = require('../../middlewares/uploader.middleware.js')


// directory setup middleware for file upload distination(will use later in uploader midd.)
const dirSetup = (req,res,next)=>{
    const uploadDir = './public/uploads/user';
    req.uploadDir = uploadDir;
    next()
}



// Auth and Authorization routes start 
router.post('/register',dirSetup,uploader.single('image'),authCtrl.register)
router.get('/verify-token/:token',authCtrl.verifyToken)
router.post("/set-password/:token",authCtrl.setPassword)
router.post("/login",authCtrl.login)
router.get('/me', (req, res, next) => {},(req, res, next) => {})
router.get("/refresh-token", (req, res, next) => {}, (req, res, next) => {})
router.get('/forget-password', (req, res, next) => {})
router.post('/logout', (req, res, next) => {}, (req, res, next) => {})


module.exports = router;