const express = require('express');
//create express app
const app = express();

// route handler
app.post('/about',(req,res)=>{
    res.json("Hello res from express app!")
})

app.get('/user/:id',(req,res,next)=>{
    const userID = req.params.id;
    res.send(`User with id ${userID} not found`)
})


//middleware
app.use('/about',(req,res,next)=>{
    res.json("Hello from middleware!")
    next()
})




//export express app
module.exports = app;