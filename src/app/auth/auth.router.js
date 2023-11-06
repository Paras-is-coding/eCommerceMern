const router = require('express').Router();
const authCtrl = require('./auth.controller.js');
const uploader = require('../../middlewares/uploader.middleware.js')
const {regSchema, passwordSchema, loginSchema, forgetPasswordSchema} = require('./auth.validator.js')
const ValidateRequest = require('../../middlewares/validate-request.middleware.js')
const checkLogin = require('../../middlewares/auth.middleware.js')
const CheckPermission = require('../../middlewares/rbac.middleware.js')


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
router.post('/logout',checkLogin, authCtrl.logoutUser)


router.get('/me',checkLogin,authCtrl.getLoggedInUser)
router.get('/admin',checkLogin,CheckPermission("admin"),(req, res, next) => {
    res.send("I'm admin role")
})
router.get('/admin-seller',checkLogin,CheckPermission(["admin","seller"]),(req, res, next) => {
    res.send("I'm admin/seller role")
})


router.post("/refresh-token",checkLogin, authCtrl.refreshToken)


router.post('/forget-password',ValidateRequest(forgetPasswordSchema),authCtrl.forgetPassword)

//{password:"",confirmPassword:""}resetToken
router.post('/reset-password/:resetToken',authCtrl.resetPassword)

module.exports = router;