const router = require('express').Router();

// route handler
router.post('/about',(req,res)=>{
    res.json("Hello res from express app!")
})

//dynamic route handler
router.get('/user/:id',(req,res,next)=>{
    const userID = req.params.id;
    res.send(`User with id ${userID} not found`)
})


// general middleware for all req methods
router.use('/',(req,res,next)=>{
    res.json("Hello from middleware!")
    next()
})



module.exports = router;