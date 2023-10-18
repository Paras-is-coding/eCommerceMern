const router = require('express').Router();
const authCtrl = require('./auth.controller.js');
const uploader = require('../../middlewares/uploader.middleware.js')
const {regSchema, passwordSchema, loginSchema} = require('./auth.validator.js')
const ValidateRequest = require('../../middlewares/validate-request.middleware.js')
const checkLogin = require('../../middlewares/auth.middleware.js')


// directory setup middleware for file upload distination(will use later in uploader midd.)
const dirSetup = (req,res,next)=>{
    const uploadDir = './public/uploads/user';
    req.uploadDir = uploadDir;
    next()
}



// Auth and Authorization routes start 
router.post('/register',dirSetup,uploader.single('image'),ValidateRequest(regSchema),authCtrl.register)

router.get('/verify-token/:token',authCtrl.verifyToken)
router.post("/set-password/:token",ValidateRequest(passwordSchema),authCtrl.setPassword)

router.post("/login",ValidateRequest(loginSchema),authCtrl.login)

router.get('/me',checkLogin,authCtrl.getLoggedInUser)
router.get('/admin',checkLogin,(req, res, next) => {})

router.get("/refresh-token",checkLogin, (req, res, next) => {})
router.get('/forget-password', (req, res, next) => {})
router.post('/logout',checkLogin, (req, res, next) => {})


module.exports = router;