const router = require('express').Router();

// Auth and Authorization routes start 
router.post('/register',(req,res,next)=>{
    res.send("Hello from register auth route")
})

router.get('/verify-token/:token', (req,res,next)=>{})
router.post("/set-password/:token", (req,res,next)=>{})

router.post("/login",(req,res,next)=>{})

router.get('/me', (req, res, next) => {},(req, res, next) => {})

router.get("/refresh-token", (req, res, next) => {}, (req, res, next) => {})

router.get('/forget-password', (req, res, next) => {})
router.post('/logout', (req, res, next) => {}, (req, res, next) => {})


module.exports = router;