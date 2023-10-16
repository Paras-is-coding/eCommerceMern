const router = require('express').Router();
const authCtrl = require('./auth.controller.js');

// Auth and Authorization routes start 
router.post('/register',authCtrl.register)
router.get('/verify-token/:token',authCtrl.verifyToken)
router.post("/set-password/:token",authCtrl.setPassword)
router.post("/login",authCtrl.login)
router.get('/me', (req, res, next) => {},(req, res, next) => {})
router.get("/refresh-token", (req, res, next) => {}, (req, res, next) => {})
router.get('/forget-password', (req, res, next) => {})
router.post('/logout', (req, res, next) => {}, (req, res, next) => {})


module.exports = router;